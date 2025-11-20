import { useState } from "react";
import { ArrowUpDown } from "lucide-react";

const bookings = [
  { date: "2025-07-01", service: "Spa", amount: 80, status: "Confirmed" },
  { date: "2025-07-03", service: "Hotel", amount: 250, status: "Pending" },
  { date: "2025-07-06", service: "Tour", amount: 120, status: "Cancelled" },
  { date: "2025-07-09", service: "Resort", amount: 400, status: "Confirmed" },
  { date: "2025-07-11", service: "Spa", amount: 90, status: "Confirmed" },
];

export const BookingTable = () => {
  const [sortAsc, setSortAsc] = useState(true);
  const [sortedData, setSortedData] = useState(bookings);

  const toggleSort = () => {
    const sorted = [...sortedData].sort((a, b) =>
      sortAsc ? b.amount - a.amount : a.amount - b.amount
    );
    setSortedData(sorted);
    setSortAsc(!sortAsc);
  };

  return (
    <div className="overflow-auto rounded-xl shadow-sm bg-white">
      <table className="min-w-full text-sm text-gray-700">
        <thead className="bg-slate-100">
          <tr>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Service</th>
            <th className="px-4 py-2 text-left cursor-pointer" onClick={toggleSort}>
              <div className="flex items-center gap-1">
                Amount <ArrowUpDown className="w-4 h-4" />
              </div>
            </th>
            <th className="px-4 py-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, idx) => (
            <tr key={idx} className="border-t">
              <td className="px-4 py-2">{row.date}</td>
              <td className="px-4 py-2">{row.service}</td>
              <td className="px-4 py-2">${row.amount}</td>
              <td className="px-4 py-2">{row.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};