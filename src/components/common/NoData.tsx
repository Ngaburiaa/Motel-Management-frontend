import { FileX2 } from "lucide-react";
import { motion } from "framer-motion";
import { Suspense } from "react";
import { Loading } from "./Loading";

interface NoDataProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const NoData = ({
  title = "No data available.",
  subtitle = "We couldn’t find any content to show here.",
  icon,
  className = "",
}: NoDataProps) => {
  return (
    <Suspense fallback={<Loading />}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`flex flex-col items-center justify-center min-h-[40vh] text-center px-4 py-10 ${className}`}
      >
        <div className="text-muted-foreground mb-4">
          {icon || <FileX2 className="w-12 h-12 text-gray-400" />}
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-1">{title}</h3>
        <p className="text-gray-500 max-w-sm">{subtitle}</p>
      </motion.div>
    </Suspense>
  );
};
