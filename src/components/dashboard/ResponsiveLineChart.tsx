// components/dashboard/ResponsiveLineChart.tsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const ResponsiveLineChart = ({ data, color }: { data: unknown[]; color: string }) => (
  <ResponsiveContainer width="100%" height={280}>
    <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
      <YAxis tick={{ fontSize: 12 }} />
      <Tooltip />
      <Line type="monotone" dataKey="value" stroke={color} strokeWidth={3} dot={{ r: 3 }} />
    </LineChart>
  </ResponsiveContainer>
);