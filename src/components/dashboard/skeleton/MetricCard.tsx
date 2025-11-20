// components/dashboard/MetricCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "../Card";
import type { ReactNode, FC } from "react";

export type Metric = {
  title: string;
  value: string;
  icon: ReactNode;
};

interface MetricCardProps {
  metric: Metric;
}

export const MetricCard: FC<MetricCardProps> = ({ metric }) => (
  <Card className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all">
    <CardHeader className="flex items-center gap-3 pb-2">
      <div className="w-9 h-9 flex items-center justify-center rounded-full bg-primary/10 text-primary">
        {metric.icon}
      </div>
      <CardTitle className="text-sm font-medium text-slate-600 uppercase tracking-wide">
        {metric.title}
      </CardTitle>
    </CardHeader>
    <CardContent className="pt-0">
      <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
    </CardContent>
  </Card>
);
