"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import JanakLogo from "./JanakLogo";
import useMutationApi from "@/hooks/useMutationApi";
import { useAuth } from "@/context/AuthContext";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginPayload {
  email: string;
  password: string;
  [key: string]: unknown;
}

interface LoginResponse {
  message: string;
}

export default function LoginForm() {
  const router = useRouter();
  const { refetch: refetchMe } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const { mutateAsync: login, isPending } = useMutationApi<
    LoginResponse,
    LoginPayload
  >({
    endpoint: "v1/auth/login",
    method: "POST",
  });

  const { mutateAsync: continueAsGuest, isPending: isGuestPending } = useMutationApi<
    LoginResponse,
    Record<string, unknown>
  >({
    endpoint: "v1/auth/guest",
    method: "POST",
  });

  const handleGuest = async () => {
    try {
      await continueAsGuest({});
      await refetchMe();
      router.push("/");
    } catch {
      // error handled by useMutationApi via toast
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login({ email: data.email, password: data.password });
      await refetchMe();
      router.push("/");
    } catch {
      // error handled by useMutationApi via toast
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <JanakLogo />

      <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-2">Welcome Back</h1>
      <p className="text-sm text-gray-500 mb-6">
        Sign in to access your dashboard, orders, and exclusive trade pricing.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email */}
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
              {...register("email")}
              className="flex-1 text-sm text-gray-800 outline-none bg-transparent"
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
              autoComplete="current-password"
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
            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isValid || isPending}
          className="w-full bg-[#1e3a5f] hover:bg-[#162f4e] active:bg-[#112540] disabled:opacity-50 text-white font-semibold py-4 rounded-xl text-base transition-colors mt-1"
        >
          {isPending ? "Signing In..." : "Log In"}
        </button>
      </form>

      <button
        type="button"
        onClick={handleGuest}
        disabled={isGuestPending}
        className="w-full text-center text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 transition-colors mt-5"
      >
        {isGuestPending ? "Loading..." : "Continue as Guest →"}
      </button>

      <div className="w-full text-center text-sm text-gray-500 mt-3">
        <span>Don&apos;t have an account? </span>
        <button
          type="button"
          onClick={() => router.push("/auth/signup")}
          className="text-[#1e3a5f] font-semibold hover:underline"
        >
          Create Account →
        </button>
      </div>
    </div>
  );
}
