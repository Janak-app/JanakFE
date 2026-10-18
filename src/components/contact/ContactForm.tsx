"use client";

import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import useContactUs, { ContactPayload } from "@/hooks/useContactUs";
import { useAuth } from "@/context/AuthContext";
import { normalizePhone, isValidIndianMobile } from "@/utils/phone";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Maximum 100 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  phone: z
    .string()
    .refine((v) => !v.trim() || isValidIndianMobile(normalizePhone(v)), "Enter a valid 10-digit mobile number"),
  subject: z.string().max(200, "Maximum 200 characters"),
  message: z.string().trim().min(1, "Message is required").max(5000, "Maximum 5000 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const inputClass = (hasError: boolean) =>
  `w-full border rounded-xl px-3.5 py-3 text-sm text-gray-800 outline-none bg-white placeholder:text-gray-400 ${
    hasError ? "border-red-400" : "border-gray-300"
  }`;

export default function ContactForm() {
  const { user } = useAuth();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors, isValid },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onChange",
    defaultValues: { name: "", email: "", phone: "", subject: "", message: "" },
  });

  // Prefill from the logged-in customer without overwriting anything typed
  useEffect(() => {
    if (!user || user.role !== "customer") return;
    if (!getValues("email")) setValue("email", user.email, { shouldValidate: true });
    if (user.phone && !getValues("phone")) setValue("phone", user.phone, { shouldValidate: true });
  }, [user, getValues, setValue]);

  const { mutateAsync: submitContact, isPending } = useContactUs();

  const onSubmit = async (data: ContactFormData) => {
    const phone = normalizePhone(data.phone);
    const subject = data.subject.trim();
    // The API rejects empty strings for optional fields, so omit them entirely
    const payload: ContactPayload = {
      name: data.name.trim(),
      email: data.email,
      message: data.message.trim(),
      ...(phone ? { phone } : {}),
      ...(subject ? { subject } : {}),
    };

    try {
      const res = await submitContact(payload);
      setSuccessMessage(res?.message ?? "Thank you for reaching out.");
      reset();
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      if (axiosError?.response?.status === 429) {
        toast.error("Too many requests, please try again in a minute");
      } else {
        toast.error(axiosError?.response?.data?.message ?? "Cannot perform the operation");
      }
    }
  };

  if (successMessage) {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-full bg-[#DCFCE7] flex items-center justify-center mb-3">
          <CheckCircle className="w-6 h-6 text-[#16A34A]" />
        </div>
        <p className="text-base font-bold text-[#111827]">Message sent</p>
        <p className="text-sm text-[#6B7280] mt-1">{successMessage}</p>
        <button
          type="button"
          onClick={() => setSuccessMessage(null)}
          className="mt-5 text-sm font-semibold text-accent"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1.5">Name *</label>
        <input {...register("name")} placeholder="Your full name" autoComplete="name" className={inputClass(!!errors.name)} />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1.5">Email *</label>
        <input type="email" {...register("email")} placeholder="you@company.com" autoComplete="email" className={inputClass(!!errors.email)} />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1.5">Mobile Number</label>
        <input
          type="tel"
          inputMode="numeric"
          maxLength={16}
          {...register("phone")}
          placeholder="98765 43210"
          autoComplete="tel"
          className={inputClass(!!errors.phone)}
        />
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1.5">Subject</label>
        <input {...register("subject")} placeholder="e.g. Bulk order enquiry" className={inputClass(!!errors.subject)} />
        {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1.5">Message *</label>
        <textarea
          {...register("message")}
          rows={5}
          placeholder="How can we help you?"
          className={`${inputClass(!!errors.message)} resize-none`}
        />
        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={!isValid || isPending}
        className="w-full bg-accent hover:bg-[#7a3232] active:bg-[#6b2a2a] disabled:opacity-50 text-white font-semibold py-4 rounded-xl text-base transition-colors"
      >
        {isPending ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
