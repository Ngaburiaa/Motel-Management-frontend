import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/common/NavBar";
import { Footer } from "../components/common/Footer";
import {
  ShieldCheck,
  BedDouble,
  Bell,
  Sparkles,
} from "lucide-react";
import { hotelName } from "../constants/constants";

export const About: React.FC = () => {

  return (
    <>
      <Navbar />
      <div className="min-h-screen w-full font-sans text-[#283618]">

        {/* Hero Section */}
        <div className="relative h-[50vh] w-full">
          <img
            src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Luxurious Hotel"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/60" />

          <div className="relative z-10 flex flex-col justify-center items-center h-full text-center text-white px-4">
            <motion.h1
              className="text-4xl lg:text-6xl font-bold mb-4"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              Welcome to <span className="text-yellow-400">{hotelName}</span>
            </motion.h1>
            <motion.p
              className="text-lg lg:text-xl text-white/90 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
            >
              Unwind in timeless elegance, where comfort meets opulence.
            </motion.p>
          </div>
        </div>

        {/* About Content */}
        <section className="px-6 py-20 bg-gradient-to-br from-[#FEFAE0] to-white">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-[#BC6C25]">
                Experience World-Class Hospitality
              </h2>
              <p className="text-lg text-[#606C38] mb-4 leading-relaxed">
                At {hotelName}, every detail is designed to inspire. From
                architecturally stunning interiors to curated gourmet dining, we
                offer more than just a place to stay — we offer a story worth
                remembering.
              </p>
              <p className="text-lg text-[#606C38] leading-relaxed">
                Whether it's a weekend getaway or a grand celebration, our
                luxurious spaces and dedicated service ensure an unmatched
                experience.
              </p>
            </motion.div>

            {/* Image */}
            <motion.div
              className="w-full h-80 rounded-xl overflow-hidden shadow-2xl"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.unsplash.com/photo-1551590192-8070a16d9f67?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Hotel Interior"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="px-6 py-20 bg-white border-t border-slate-200">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl font-bold text-center mb-12 text-[#283618]">
              Why Guests Love {hotelName}
            </h3>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 text-center">
              {[
                {
                  icon: <BedDouble className="w-10 h-10 mx-auto text-[#DDA15E]" />,
                  title: "Elegant Rooms",
                  desc: "Spacious suites with premium furnishings and panoramic views.",
                },
                {
                  icon: (
                    <Bell className="w-10 h-10 mx-auto text-[#BC6C25]" />
                  ),
                  title: "24/7 Service",
                  desc: "Our concierge team ensures every need is catered to instantly.",
                },
                {
                  icon: <ShieldCheck className="w-10 h-10 mx-auto text-[#606C38]" />,
                  title: "Secure & Private",
                  desc: "Top-tier security and discretion for all our guests.",
                },
                {
                  icon: <Sparkles className="w-10 h-10 mx-auto text-[#283618]" />,
                  title: "Luxury Amenities",
                  desc: "Infinity pools, rooftop lounges, spas, and curated experiences.",
                },
              ].map(({ icon, title, desc }, index) => (
                <motion.div
                  key={index}
                  className="bg-[#FEFAE0] border border-[#DDA15E]/30 rounded-xl p-6 shadow hover:shadow-md transition"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  {icon}
                  <h4 className="mt-4 font-semibold text-lg text-[#283618]">
                    {title}
                  </h4>
                  <p className="mt-2 text-sm text-[#4B5563]">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="bg-[#14213d] text-white px-6 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <motion.h3
              className="text-3xl font-semibold mb-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              Our Mission
            </motion.h3>
            <motion.p
              className="text-lg text-white/90"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              To redefine luxury by delivering curated, heartfelt experiences
              that inspire relaxation, wonder, and connection in every moment.
            </motion.p>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};
