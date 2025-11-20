import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newsletterSchema, type NewsletterFormSchema } from "../../validation/newsletterValidator";
import { Mail } from "lucide-react";
import { useSubscribeToNewsletterMutation } from "../../features/api/newsletterApi";
import { toast } from "react-hot-toast";
import { parseRTKError } from "../../utils/parseRTKError";

export const Newsletter: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterFormSchema>({
    resolver: zodResolver(newsletterSchema),
  });

  const [subscribeToNewsletter] = useSubscribeToNewsletterMutation();

  const onSubmit = async (data: NewsletterFormSchema) => {
    try {
      const res = await subscribeToNewsletter({ email: data.email }).unwrap();
      toast.success(res.message || "Successfully subscribed!");
      reset();
    } catch (err) {
      const errorMessage = parseRTKError(err, "Subscription failed. Please try again.");
      toast.error(errorMessage);
    }
  };

  return (
    <section className="w-full bg-gradient-to-br from-slate-50 to-slate-200 py-20 px-6">
      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-8 sm:p-10 text-center">
        <div className="flex items-center justify-center mb-4 text-blue-800">
          <Mail className="w-8 h-8 mr-2" />
          <h2 className="text-2xl sm:text-3xl font-bold">Join Our Newsletter</h2>
        </div>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">
          Stay updated with the latest news, offers, and updates. No spam.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-full">
              <input
                id="email"
                type="email"
                {...register("email")}
                placeholder="you@example.com"
                className={`w-full text-black px-4 py-2 text-sm border rounded-lg outline-none transition ${
                  errors.email
                    ? "border-red-500 focus:ring-2 focus:ring-red-300"
                    : "border-gray-300 focus:ring-2 focus:ring-blue-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
