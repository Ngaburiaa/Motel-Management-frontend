import { motion } from "framer-motion";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export const FadeIn = ({ children, delay = 0.1, duration = 0.6, className }: FadeInProps) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration, delay }}
    viewport={{ once: true }}
  >
    {children}
  </motion.div>
);
