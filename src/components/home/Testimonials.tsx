
import { motion } from "framer-motion";

export const Testimonials = () => {
  const feedback = [
    { name: "Floyd Miles", comment: "Lorem ipsum dolor sit amet.", image: "/images/user1.jpg", rating: 5 },
    { name: "Ronald Richards", comment: "Excellent experience!", image: "/images/user2.jpg", rating: 4 },
    { name: "Savannah Nguyen", comment: "Great location and services!", image: "/images/user3.jpg", rating: 5 }
  ];

  return (
    <section className="bg-gradient-to-br from-slate-100 to-slate-200 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-600 text-center mb-2">Our Customer Feedback</h2>
        <p className="text-sm text-gray-500 text-center mb-10">Don't take our word for it. Trust our customers.</p>
        <div className="grid md:grid-cols-3 gap-8">
          {feedback.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <img src={f.image} alt={f.name} className="w-12 h-12 rounded-full border border-gray-200" />
                <div>
                  <h3 className="text-base font-semibold text-gray-700">{f.name}</h3>
                  <p className="text-sm text-yellow-500">{"★".repeat(f.rating)}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">{f.comment}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

