import { Tabs, TabsList, TabsTrigger } from "../dashboard/tabs";
import type { TBookingStatus } from "../../types/bookingsTypes";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

type TabValue = "All" | TBookingStatus;

interface BookingTabsProps {
  current: TabValue;
  setCurrent: (status: TabValue) => void;
}

const tabItems: TabValue[] = ["All", "Confirmed", "Pending", "Cancelled"];

export const BookingTabs = ({ current, setCurrent }: BookingTabsProps) => {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const handleValueChange = (value: string) => {
    setCurrent(value as TabValue);
  };

  useEffect(() => {
    const activeIndex = tabItems.findIndex((item) => item === current);
    const activeTab = tabRefs.current[activeIndex];
    if (activeTab) {
      setIndicatorStyle({
        left: activeTab.offsetLeft,
        width: activeTab.offsetWidth,
      });
    }
  }, [current]);

  return (
    <Tabs value={current} onValueChange={handleValueChange} className="w-full">
      <TabsList
        className={cn(
          "relative flex w-full overflow-x-auto scrollbar-hide px-2 py-1 bg-[#14213D] rounded-xl shadow-md border border-[#e5e5e5]",
          "min-h-[48px]"
        )}
      >
        {/* Animated Indicator */}
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute top-[4px] bottom-[4px] rounded-xl bg-[#FCA311] z-0"
          style={indicatorStyle}
        />

        {/* Tabs */}
        {tabItems.map((status) => (
          <TabsTrigger
            key={status}
            value={status}
            className={cn(
              "relative z-10 px-5 py-2 text-sm font-semibold transition-all duration-200 ease-in-out rounded-xl whitespace-nowrap",
              current === status
                ? "text-black"
                : "text-white hover:text-[#FCA311]"
            )}
          >
            {status}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
