import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Send } from "lucide-react";
import toast from "react-hot-toast";
import { useForgotPasswordMutation } from "../features/api/authApi";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

const ForgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof ForgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const onSubmit: SubmitHandler<ForgotPasswordFormValues> = async (data) => {
    try {
      await forgotPassword(data).unwrap();
      toast.success("Password reset link sent to your email.");
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
    <div className="min-h-screen flex items-center justify-center bg-[url('https://inforalosso.weebly.com/uploads/8/0/5/1/80513492/3794964_orig.jpg')] bg-cover bg-center px-4 py-12 font-body">
      <div className="w-full max-w-md bg-base-100/90 backdrop-blur-md border border-base-200 shadow-xl rounded-2xl p-10 animate-fade-in">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-white font-heading">
            Forgot Password
          </h1>
          <p className="text-sm text-muted mt-2">
            We'll email you a reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm text-white font-medium mb-1"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute text-black left-3 top-3.5 h-5 w-5 text-muted" />
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className={`w-full rounded-lg border ${
                  errors.email ? "border-error" : "border-base-200"
                } bg-white py-2.5 pl-10 pr-4 text-sm text-black placeholder-muted focus:outline-none focus:ring-2 focus:ring-gold transition duration-200`}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-error mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gold bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition duration-200"
          >
            <Send className="w-5 h-5" />
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* Navigation */}
        <div className="text-center mt-6">
          <a
            href="/login"
            className="text-sm text-muted hover:text-gold transition duration-150"
          >
            ← Back to Login
          </a>
        </div>
      </div>

      {/* Animation */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
