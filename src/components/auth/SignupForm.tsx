"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Zap } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import JanakLogo from "./JanakLogo";
import useMutationApi from "@/hooks/useMutationApi";

const signupSchema = z
  .object({
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    password: z
      .string()
      .min(8, "Minimum 8 characters")
      .regex(/[a-z]/, "At least 1 lowercase letter")
      .regex(/[A-Z]/, "At least 1 uppercase letter")
      .regex(/\d/, "At least 1 number")
      .regex(/[@$%*?&]/, "At least 1 special character (@$%*?&)"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

interface RegisterPayload {
  email: string;
  password: string;
  guestToken: string;
  [key: string]: unknown;
}

interface RegisterResponse {
  message: string;
}

export default function SignupForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const { mutateAsync: registerUser, isPending } = useMutationApi<
    RegisterResponse,
    RegisterPayload
  >({
    endpoint: "v1/auth/register",
    method: "POST",
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      const guestToken = localStorage.getItem("guestToken") ?? "";
      await registerUser({
        email: data.email,
        password: data.password,
        guestToken,
      } as RegisterPayload);
      router.push("/");
    } catch {
      // error handled by useMutationApi via toast
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <JanakLogo />

      <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-2">
        Create Account
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Join the trade network to access exclusive pricing, orders, and your
        dashboard.
      </p>

      {/* Demo mode banner */}
      <div className="border border-yellow-300 bg-yellow-50 rounded-xl p-4 mb-7">
        <div className="flex items-center gap-1.5 mb-1">
          <Zap className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
          <span className="text-[11px] font-bold text-yellow-700 tracking-widest uppercase">
            Demo Mode
          </span>
        </div>
        <p className="text-sm text-gray-700">
          Fill in valid details and tap{" "}
          <span className="font-semibold">Sign Up</span>.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Work Email */}
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1.5">
            Work Email
          </label>
          <div
            className={`flex items-center border rounded-xl px-3.5 py-3 gap-2.5 bg-white ${
              errors.email ? "border-red-400" : "border-gray-300"
            }`}
          >
            <Mail className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="email"
              placeholder="you@company.com"
              {...register("email")}
              className="flex-1 text-sm text-gray-800 outline-none bg-transparent placeholder:text-gray-400"
              autoComplete="email"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1.5">
            Password
          </label>
          <div
            className={`flex items-center border rounded-xl px-3.5 py-3 gap-2.5 bg-white ${
              errors.password ? "border-red-400" : "border-gray-300"
            }`}
          >
            <Lock className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              className="flex-1 text-sm text-gray-800 outline-none bg-transparent"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1.5">
            Confirm Password
          </label>
          <div
            className={`flex items-center border rounded-xl px-3.5 py-3 gap-2.5 bg-white ${
              errors.confirmPassword ? "border-red-400" : "border-gray-300"
            }`}
          >
            <Lock className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword")}
              className="flex-1 text-sm text-gray-800 outline-none bg-transparent"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isValid || isPending}
          className="w-full bg-[#1e3a5f] hover:bg-[#162f4e] active:bg-[#112540] disabled:opacity-50 text-white font-semibold py-4 rounded-xl text-base transition-colors mt-1"
        >
          {isPending ? "Signing Up..." : "Sign Up"}
        </button>
      </form>

      <div className="w-full text-center text-sm text-gray-500 hover:text-gray-700 transition-colors mt-5">
        <span>Already have an account? </span>
        <button
          type="button"
          onClick={() => router.push("/auth/login")}
        >
          Log In →
        </button>
      </div>
    </div>
  );
}
