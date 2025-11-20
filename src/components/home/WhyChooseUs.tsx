import { ShieldCheck, BadgeDollarSign, Clock, Undo2 } from "lucide-react";
import { FadeIn } from "../animations/FadeIn";

export const WhyChooseUs = () => {
  const features = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-blue-600" />,
      title: "Verified Hotels",
      description: "Every hotel listed is quality-checked and verified by our travel team.",
    },
    {
      icon: <BadgeDollarSign className="w-8 h-8 text-blue-600" />,
      title: "Best Price Guarantee",
      description: "We offer the most competitive prices with exclusive deals and discounts.",
    },
    {
      icon: <Clock className="w-8 h-8 text-blue-600" />,
      title: "24/7 Support",
      description: "Our support team is always available to assist you, day or night.",
    },
    {
      icon: <Undo2 className="w-8 h-8 text-blue-600" />,
      title: "Easy Cancellation",
      description: "Plans changed? Most bookings offer free cancellation up to 24 hours.",
    },
  ];

  return (
    <section className="bg-gradient-to-br from-slate-100 to-slate-200 py-16 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">
            Why Book With Us?
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto mb-12">
            Discover why thousands of travelers trust our platform to find and book their perfect stay.
          </p>
        </FadeIn>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {features.map((feature, index) => (
            <FadeIn key={index} delay={0.1 * index}>
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 text-left space-y-4">
                <div className="flex items-center justify-center md:justify-start">
                  <div className="bg-blue-100 p-3 rounded-full">
                    {feature.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">{feature.title}</h3>
                  <p className="text-gray-500 text-sm">{feature.description}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};
