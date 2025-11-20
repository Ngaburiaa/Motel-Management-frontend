// components/dashboard/Tabs.tsx
import * as React from "react";
import { cn } from "../../lib/utils";

interface TabsProps {
  value: string;
  onValueChange: (val: string) => void;
  children: React.ReactNode;
  className?: string;
}

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (val: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

export const Tabs: React.FC<TabsProps> = ({ value, onValueChange, children, className }) => {
  const contextValue: TabsContextValue = {
    activeTab: value,
    setActiveTab: onValueChange,
  };

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
};

function useTabsContext() {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used inside a <Tabs /> provider");
  }
  return context;
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export const TabsList: React.FC<TabsListProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "flex gap-2 p-1 bg-base-200 border border-base-300 rounded-xl shadow-sm w-full",
        className
      )}
    >
      {children}
    </div>
  );
};

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children, className }) => {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={cn(
        "flex-1 text-sm font-medium px-4 py-2 rounded-lg transition duration-150",
        isActive
          ? "bg-primary text-white shadow-md"
          : "text-muted hover:text-primary",
        className
      )}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const TabsContent: React.FC<TabsContentProps> = ({ value, children, className }) => {
  const { activeTab } = useTabsContext();
  return activeTab === value ? <div className={cn("pt-4", className)}>{children}</div> : null;
};