import { Eye, Trash2 } from "lucide-react";
import type { TPaymentSelect, TPaymentStatus } from "../../types/paymentsTypes";
import { cn } from "../../lib/utils";

interface PaymentCardProps {
  payment: TPaymentSelect;
  onView: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}

export const PaymentCard = ({
  payment,
  onView,
  onDelete,
  isDeleting,
}: PaymentCardProps) => {
  return (
    <div className="flex items-center justify-between bg-base-100 rounded-xl px-5 py-4 border border-base-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex-1 overflow-hidden space-y-1">
        <p className="truncate font-semibold text-base-content text-sm md:text-base">
          #{payment.transactionId ?? "N/A"} — <span className="text-primary font-bold">${payment.amount}</span>
        </p>

        <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
          <span>{new Date(payment.paymentDate).toLocaleDateString()}</span>

          <span className="badge badge-sm border border-base-200 text-muted capitalize bg-base-200">
            {payment.paymentMethod}
          </span>

          <span
            className={cn(
              "badge badge-sm capitalize text-white",
              payment.paymentStatus === ("Confirmed" as TPaymentStatus)
                ? "bg-success"
                : payment.paymentStatus === ("Pending" as TPaymentStatus)
                ? "bg-warning text-base-content"
                : "bg-error"
            )}
          >
            {payment.paymentStatus}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-4">
        <button
          className="btn btn-sm btn-outline btn-info"
          onClick={onView}
          disabled={isDeleting}
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          className="btn btn-sm btn-outline btn-error"
          onClick={onDelete}
          disabled={isDeleting}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
