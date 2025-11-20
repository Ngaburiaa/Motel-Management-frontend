import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { loginSchema, type LoginData } from "../validation/login.validation";
import { authApi } from "../features/api/authApi";
import { Loading } from "../components/common/Loading";
import { useDispatch } from "react-redux";
import { persistCredentials } from "../features/auth/authSlice";
import Navbar from "../components/common/NavBar";
import { Footer } from "../components/common/Footer";

export const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const [loginUser, { isLoading }] = authApi.useLoginUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginData) => {
    try {
      const response = await loginUser(data).unwrap();
      dispatch(persistCredentials(response));
      toast.success(`Welcome back, ${response.firstName}!`);
      // navigate(response.userType === "admin" ? "/admin/analytics" : "/user/analytics");
      navigate(response.userType === "admin" ? "/admin/analytics" : ( response.userType === "user" ? "/user/analytics" : "/about"));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const status = error?.status;
      if (status === 401) toast.error("Invalid email or password");
      else if (status === 400) toast.error("Invalid input, check your form");
      else if (status === 500) toast.error("Server error, try again later");
      else if (status === "FETCH_ERROR") toast.error("Network error");
      else toast.error("Login failed. Please try again");
    }
  };

  if (isLoading) return <Loading />;

  return (
    <>
    <Navbar/>
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center px-4 py-12 font-body"
      style={{
        backgroundImage:
          "url('https://media.istockphoto.com/id/104731717/photo/luxury-resort.jpg?s=612x612&w=0&k=20&c=cODMSPbYyrn1FHake1xYz9M8r15iOfGz9Aosy9Db7mI=')",
      }}
    >
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />

      <div className="w-full max-w-md bg-base-100/90 backdrop-blur-md shadow-xl border border-base-200 rounded-2xl p-10 animate-fade-in">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-heading font-bold text-base-content tracking-tight">
            Vil<span className="text-gold">las</span>
          </h1>
          <p className="text-sm text-muted mt-1">Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label className="text-sm font-medium text-base-content block mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 text-black top-3.5 h-5 w-5 text-muted" />
              <input
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className="w-full text-black rounded-lg border border-base-200 bg-white py-2 pl-10 pr-4 text-sm placeholder-muted shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-error mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-base-content block mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute text-black left-3 top-3.5 h-5 w-5 text-muted" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                className="w-full rounded-lg text-black border border-base-200 bg-white py-2 pl-10 pr-10 text-sm placeholder-muted shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-3.5 text-muted hover:text-primary transition"
              >
                {showPassword ? <EyeOff className="w-5 h-5 text-black" /> : <Eye className="w-5 h-5 text-black" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-error mt-1">{errors.password.message}</p>
            )}
            <div className="text-right mt-1">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-primary hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2.5 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg text-sm flex items-center justify-center gap-2 transition-all duration-200"
          >
            <LogIn className="w-5 h-5" />
            Log In
          </button>
        </form>

        {/* Register link */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/register")}
            className="text-sm text-muted hover:text-primary transition"
          >
            Don’t have an account? <span className="font-semibold">Register</span>
          </button>
        </div>
      </div>

      {/* Animation */}
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
    <Footer/>
    </>
  );
};
