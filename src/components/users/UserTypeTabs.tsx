import { Users, ShieldCheck, UserCircle, PersonStanding } from "lucide-react";
import { cn } from "../../lib/utils";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

const userTypes = [
  { type: "all", label: "All", icon: PersonStanding },
  { type: "user", label: "Users", icon: Users },
  { type: "owner", label: "Owners", icon: UserCircle },
  { type: "admin", label: "Admins", icon: ShieldCheck },
];

interface Props {
  selectedType: string;
  onSelect: (type: string) => void;
}

export const UserTypeTabs: React.FC<Props> = ({ selectedType, onSelect }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const index = userTypes.findIndex((u) => u.type === selectedType);
    setActiveIndex(index);
  }, [selectedType]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div
        ref={containerRef}
        className="relative bg-white rounded-full flex justify-between items-center px-2 shadow-md"
      >
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute top-1 bottom-1 rounded-full bg-primary z-0"
          style={{
            left: `${(100 / userTypes.length) * activeIndex}%`,
            width: `${100 / userTypes.length}%`,
          }}
        />

        {userTypes.map(({ type, label, icon: Icon }) => {
          const isActive = selectedType === type;
          return (
            <button
              key={type}
              onClick={() => onSelect(type)}
              className={cn(
                "relative z-10 w-full flex justify-center items-center gap-2 py-2 text-sm font-semibold rounded-full transition-all duration-300",
                isActive ? "text-white" : "text-muted"
              )}
              style={{
                width: `${100 / userTypes.length}%`,
              }}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
