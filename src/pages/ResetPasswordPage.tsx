import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";
import { Lock, Mail, KeyRound, ShieldCheck, Loader2 } from "lucide-react";
import { useResetPasswordMutation } from "../features/api/authApi";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

const ResetPasswordSchema = z
  .object({
    email: z.string().email("Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof ResetPasswordSchema>;

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(ResetPasswordSchema),
  });

  const onSubmit: SubmitHandler<ResetPasswordFormValues> = async (data) => {
    if (!token) {
      toast.error("Invalid or missing token.");
      return;
    }

    try {
      await resetPassword({ ...data, token }).unwrap();
      toast.success("Password reset successful!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error: unknown) {
      const err = error as FetchBaseQueryError;
      const errorMessage =
        "data" in err && typeof err.data === "object" && err.data !== null
          ? (err.data as { error?: string }).error || "Something went wrong"
          : "Network error or unknown error";
      toast.error(errorMessage);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center relative font-body"
      style={{
        backgroundImage:
          "url('https://www.ghmhotels.com/wp-content/uploads/CAM-Dining-The-Courtyard-Night021-865x780.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md" />
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />

      <div className="relative z-10 w-full max-w-md bg-base-100/90 border border-base-200 rounded-2xl p-10 shadow-xl animate-fade-in">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-heading font-bold text-base-content">
            Reset<span className="text-gold">Password</span>
          </h1>
          <p className="text-sm text-muted mt-1">
            Create a new password for your account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <FormField
            label="Email"
            type="email"
            placeholder="you@example.com"
            icon={<Mail className="text-muted" />}
            register={register("email")}
            error={errors.email?.message}
            disabled={isLoading}
          />

          {/* New Password */}
          <FormField
            label="New Password"
            type="password"
            placeholder="Enter new password"
            icon={<KeyRound className="text-muted" />}
            register={register("password")}
            error={errors.password?.message}
            disabled={isLoading}
          />

          {/* Confirm Password */}
          <FormField
            label="Confirm Password"
            type="password"
            placeholder="Re-enter new password"
            icon={<ShieldCheck className="text-muted" />}
            register={register("confirmPassword")}
            error={errors.confirmPassword?.message}
            disabled={isLoading}
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg text-sm flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="text-center mt-6">
          <a href="/login" className="text-sm text-muted hover:text-primary transition">
            Back to Login
          </a>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out both;
        }
      `}</style>
    </div>
  );
}

type FormFieldProps = {
  label: string;
  type: string;
  placeholder: string;
  icon: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  error?: string;
  disabled?: boolean;
};

const FormField = ({
  label,
  type,
  placeholder,
  icon,
  register,
  error,
  disabled,
}: FormFieldProps) => (
  <div>
    <label className="text-sm font-medium text-base-content block mb-1">{label}</label>
    <div className="relative">
      <span className="absolute left-3 text-black top-3.5 w-5 h-5">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        {...register}
        disabled={disabled}
        className="w-full rounded-lg border text-black border-base-200 bg-white py-2.5 pl-10 pr-4 text-sm placeholder-muted shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
      />
    </div>
    {error && <p className="text-xs text-error mt-1">{error}</p>}
  </div>
);
