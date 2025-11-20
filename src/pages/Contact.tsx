import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, ChevronDown } from "lucide-react";
import Navbar from "../components/common/NavBar";
import { Footer } from "../components/common/Footer";
import toast from "react-hot-toast";
import { useSendContactMessageMutation } from "../features/api/contactApi";
import { parseRTKError } from "../utils/parseRTKError";
import { hotelContact, supportEmail } from "../constants/constants";

export const Contact: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // RTK mutation hook
  const [sendContactMessage, { isLoading }] = useSendContactMessageMutation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleScroll = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, email, message } = form;

    // Client-side validation
    if (!name || !email || !message) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Invalid email address.");
      return;
    }

    try {
      await sendContactMessage({ name, email, message }).unwrap();
      toast.success("Message sent successfully!");
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      const errorMessage = parseRTKError(error, "Failed to send the message.");
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1587560699334-bea93391dcef?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          }}
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 flex flex-col lg:flex-row items-center justify-between gap-10 text-white">
          {/* Heading */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-5xl lg:text-6xl font-bold mb-4 drop-shadow">
              Let's Talk <br />
              <span className="text-yellow-400">Get In Touch</span>
            </h1>
            <p className="text-lg text-white/90 mt-4 max-w-md">
              Whether you're planning your next getaway, have a question, or
              just want to say hi — we’d love to hear from you.
            </p>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="flex-1 w-full max-w-md"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-2xl space-y-5 text-slate-900"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-lg bg-white/60 border border-white/50 text-slate-900 placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="relative">
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 rounded-lg bg-white/60 border border-white/50 text-slate-900 placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  value={form.email}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="relative">
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-white/60 border border-white/50 text-slate-900 placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                  value={form.message}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, message: e.target.value }))
                  }
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full ${
                  isLoading
                    ? "bg-yellow-400 cursor-not-allowed"
                    : "bg-yellow-500 hover:bg-yellow-600"
                } text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-md`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Scroll button */}
        <motion.button
          onClick={handleScroll}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 text-yellow-400 hover:text-yellow-300 transition"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ChevronDown className="w-8 h-8" />
        </motion.button>
      </div>

      {/* Contact Info */}
      <div
        ref={scrollRef}
        className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center px-6 py-20 text-slate-900 text-center"
      >
        <h2 className="text-4xl font-bold mb-6">Our Contact Info</h2>
        <div className="space-y-4 max-w-xl">
          <p className="flex items-center justify-center gap-3 text-lg">
            <MapPin className="w-5 h-5 text-yellow-500" />
            Nairobi, Kenya
          </p>
          <p className="flex items-center justify-center gap-3 text-lg">
            <Mail className="w-5 h-5 text-yellow-500" />
            {supportEmail}
          </p>
          <p className="flex items-center justify-center gap-3 text-lg">
            <Phone className="w-5 h-5 text-yellow-500" />
            {hotelContact}
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
};
