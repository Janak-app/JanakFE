"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Check } from "lucide-react";
import Button from "@/components/ui/Button";
import useMutationApi, { DynamicMutationPayload } from "@/hooks/useMutationApi";

const LABELS = ["HOME", "WORK", "OTHER"] as const;

const addressSchema = z.object({
  label: z.enum(LABELS, { required_error: "Select a label" }),
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().min(10, "Enter a valid phone number").max(13),
  addressLine1: z.string().min(1, "Address line 1 is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().length(6, "Enter a valid 6-digit pincode"),
  isDefault: z.boolean(),
});

type AddressFormData = z.infer<typeof addressSchema>;

export type SavedAddress = {
  id: string;
  label: string;
  fullName: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

interface AddressFormProps {
  onSave: (address: SavedAddress) => void;
  onClose: () => void;
}

const inputCls =
  "w-full h-11 bg-[#F5F5F7] border border-[#E5E7EB] rounded-lg px-3 text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none focus:border-[#1A4F9C] transition-colors";

function Field({
  label,
  error,
  children,
  className = "",
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-xs font-semibold text-[#374151]">{label}</label>
      {children}
      {error && <p className="text-[11px] text-[#DC2626]">{error}</p>}
    </div>
  );
}

export default function AddressForm({ onSave, onClose }: AddressFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: { isDefault: false },
    mode: "onChange",
  });

  const mutation = useMutationApi<SavedAddress>({
    method: "post",
    endpoint: "v1/addresses",
  });

  const onSubmit = (formData: AddressFormData) => {
    mutation.mutate(formData as DynamicMutationPayload, {
      onSuccess: (data) => {
        onSave(data);
      },
    });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 px-4 pt-5 pb-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <p className="text-base font-bold text-[#111827]">Add New Address</p>
          <button onClick={onClose} className="p-1">
            <X className="w-5 h-5 text-[#6B7280]" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          {/* Label chips */}
          <Field label="Address Type" error={errors.label?.message}>
            <Controller
              name="label"
              control={control}
              render={({ field }) => (
                <div className="flex gap-2">
                  {LABELS.map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => field.onChange(l)}
                      className={`flex-1 h-10 rounded-lg border text-xs font-bold tracking-wide transition-colors ${
                        field.value === l
                          ? "border-[#1A4F9C] bg-[#EFF6FF] text-[#1A4F9C]"
                          : "border-[#E5E7EB] bg-white text-[#6B7280]"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              )}
            />
          </Field>

          <Field label="Full Name" error={errors.fullName?.message}>
            <input
              {...register("fullName")}
              placeholder="e.g. Arjun Mehta"
              className={inputCls}
            />
          </Field>

          <Field label="Phone Number" error={errors.phone?.message}>
            <input
              {...register("phone")}
              type="tel"
              placeholder="e.g. 9820045678"
              className={inputCls}
            />
          </Field>

          <Field label="Address Line 1" error={errors.addressLine1?.message}>
            <input
              {...register("addressLine1")}
              placeholder="Flat / House no, Building, Street"
              className={inputCls}
            />
          </Field>

          <Field label="Address Line 2 (optional)" error={errors.addressLine2?.message}>
            <input
              {...register("addressLine2")}
              placeholder="Area, Landmark"
              className={inputCls}
            />
          </Field>

          <div className="flex gap-3">
            <Field label="City" error={errors.city?.message} className="flex-1">
              <input {...register("city")} placeholder="Mumbai" className={inputCls} />
            </Field>
            <Field label="Pincode" error={errors.pincode?.message} className="flex-1">
              <input
                {...register("pincode")}
                placeholder="400069"
                maxLength={6}
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="State" error={errors.state?.message}>
            <input {...register("state")} placeholder="Maharashtra" className={inputCls} />
          </Field>

          {/* Set as default toggle */}
          <Controller
            name="isDefault"
            control={control}
            render={({ field }) => (
              <button
                type="button"
                onClick={() => field.onChange(!field.value)}
                className="flex items-center gap-3 py-1"
              >
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                    field.value ? "bg-[#1A4F9C] border-[#1A4F9C]" : "border-[#D1D5DB]"
                  }`}
                >
                  {field.value && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                </div>
                <span className="text-sm text-[#374151] font-medium">Set as default address</span>
              </button>
            )}
          />

          <div className="mt-2">
            <Button
              label="Save Address"
              type="submit"
              disabled={!isValid || mutation.isPending}
              loading={mutation.isPending}
            />
          </div>
        </form>
      </div>
    </>
  );
}
