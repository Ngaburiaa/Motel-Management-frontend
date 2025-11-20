import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import {
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCreateUserMutation } from "../features/api";
import { Footer } from "../components/common/Footer";
import Navbar from "../components/common/NavBar";

// ✅ Validation schema
const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Enter a valid email address"),
    phone: z.string().min(10, "Enter a valid phone number"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterData = z.infer<typeof registerSchema>;

export const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [registerUser, { isLoading }] = useCreateUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterData) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...userData } = data;
      await registerUser(userData).unwrap();
      toast.success("Registered successfully!", {
        iconTheme: {
          primary: "#D4AF37",
          secondary: "white",
        },
      });
      navigate("/login");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("User already exists", {
        style: { fontWeight: "500" },
      });
    }
  };

  return (
    <>
      <Navbar />
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center relative px-4 py-12"
        style={{
          backgroundImage:
            "url('https://cdn.britannica.com/96/115096-050-5AFDAF5D/Bellagio-Hotel-Casino-Las-Vegas.jpg')",
        }}
      >
        {/* Glass overlay */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-md" />

        {/* Card */}
        <div className="relative z-10 w-full max-w-4xl bg-base-100/90 backdrop-blur-md p-10 rounded-2xl shadow-xl grid md:grid-cols-2 gap-10 animate-fade-in font-body">
          {/* Left Side */}
          <div className="flex flex-col justify-center text-center md:text-left">
            <h1 className="text-5xl font-heading font-bold text-white mb-2">
              StayCloud
            </h1>
            <p className="text-sm text-muted text-white mb-6">
              Register now and begin your luxurious escape.
            </p>
          </div>

          {/* Right Side - Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name Fields */}
            <div className="grid sm:grid-cols-2 gap-4">
              <FormInput
                label="First Name"
                icon={User}
                type="text"
                placeholder="John"
                register={register("firstName")}
                error={errors.firstName?.message}
                disabled={isLoading}
              />
              <FormInput
                label="Last Name"
                icon={User}
                type="text"
                placeholder="Doe"
                register={register("lastName")}
                error={errors.lastName?.message}
                disabled={isLoading}
              />
            </div>

            <FormInput
              label="Phone"
              icon={Phone}
              type="tel"
              placeholder="0712345678"
              register={register("phone")}
              error={errors.phone?.message}
              disabled={isLoading}
            />

            <FormInput
              label="Email"
              icon={Mail}
              type="email"
              placeholder="you@example.com"
              register={register("email")}
              error={errors.email?.message}
              disabled={isLoading}
            />

            {/* Password Field with Toggle */}
            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-muted" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  disabled={isLoading}
                  className="w-full py-2.5 pl-10 pr-10 rounded-lg text-sm bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary text-black transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-muted hover:text-primary transition"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-error text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <FormInput
              label="Confirm Password"
              icon={Lock}
              type="password"
              placeholder="••••••••"
              register={register("confirmPassword")}
              error={errors.confirmPassword?.message}
              disabled={isLoading}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-focus text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Register
                </>
              )}
            </button>

            <div className="text-center mt-4">
              <button
                onClick={() => navigate("/login")}
                className="text-sm text-primary hover:underline transition"
              >
                Already have an account?{" "}
                <span className="font-medium">Login</span>
              </button>
            </div>
          </form>
        </div>

        {/* Custom styles */}
        <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .text-gold {
          color: #D4AF37;
        }
      `}</style>
      </div>
      <Footer />
    </>
  );
};

// 📦 Floating Input Component
type FormInputProps = {
  label: string;
  icon: React.ElementType;
  type: string;
  placeholder: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  error?: string;
  disabled?: boolean;
};

const FormInput = ({
  label,
  icon: Icon,
  type,
  placeholder,
  register,
  error,
  disabled,
}: FormInputProps) => (
  <div>
    <label className="block text-sm font-medium text-white mb-1">{label}</label>
    <div className="relative">
      <Icon className="absolute left-3 top-3.5 w-5 h-5 text-muted" />
      <input
        type={type}
        placeholder={placeholder}
        className="w-full pl-10 py-2.5 text-sm rounded-lg bg-slate-100 text-black focus:outline-none focus:ring-2 focus:ring-primary transition"
        {...register}
        disabled={disabled}
      />
    </div>
    {error && <p className="text-error text-xs mt-1">{error}</p>}
  </div>
);
