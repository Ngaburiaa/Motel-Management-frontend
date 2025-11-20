import { type LucideIcon, AlertCircle, DollarSign, XCircle } from 'lucide-react';

type Props = {
  title: string;
  value: string | number;
  badge: string;
  badgeColor: string;
  icon: 'dollar-sign' | 'x-circle' | 'alert-circle';
  iconColor: string;
};

const icons: Record<string, LucideIcon> = {
  'dollar-sign': DollarSign,
  'x-circle': XCircle,
  'alert-circle': AlertCircle,
};

export const UserDashboardCard = ({ title, value, badge, badgeColor, icon, iconColor }: Props) => {
  const Icon = icons[icon];

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-5 hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm text-gray-500 uppercase tracking-wide">{title}</h4>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <div className={`w-2 h-2 rounded-full mr-2 ${badgeColor}`} />
            {badge}
          </div>
        </div>
        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
};
