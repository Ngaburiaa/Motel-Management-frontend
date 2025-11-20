// utils/exportPDF.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { TPaymentSelect } from "../types/paymentsTypes";

export const exportSinglePaymentToPDF = (payment: TPaymentSelect) => {
  const doc = new jsPDF();

  doc.text("Payment Details", 14, 20);

  const details = [
    ["Transaction ID", payment.transactionId ?? "N/A"],
    ["Amount", `$${payment.amount}`],
    ["Status", payment.paymentStatus],
    ["Method", payment.paymentMethod],
    ["Date", new Date(payment.paymentDate).toLocaleDateString()],
    ["Booking ID", payment.booking.bookingId.toString()],
    ["Check-in", payment.booking.checkInDate],
    ["Check-out", payment.booking.checkOutDate],
  ];

  autoTable(doc, {
    startY: 30,
    head: [["Field", "Value"]],
    body: details,
    styles: { fontSize: 10 },
  });

  doc.save(`payment-${payment.transactionId ?? payment.paymentId}.pdf`);
};

export const exportMultiplePaymentsToPDF = (payments: TPaymentSelect[]) => {
  const doc = new jsPDF();
  doc.text("All Payments Report", 14, 20);

  const tableBody = payments.map((p) => [
    p.transactionId ?? "N/A",
    `$${p.amount}`,
    new Date(p.paymentDate).toLocaleDateString(),
    p.paymentMethod,
    p.paymentStatus,
    p.booking.bookingId.toString(),
  ]);

  autoTable(doc, {
    startY: 30,
    head: [["Transaction ID", "Amount", "Date", "Method", "Status", "Booking ID"]],
    body: tableBody,
    styles: { fontSize: 9 },
    headStyles: {
      fillColor: [33, 37, 41], // dark gray
      textColor: 255,
    },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    margin: { left: 14, right: 14 },
  });

  doc.save("all-payments.pdf");
};
