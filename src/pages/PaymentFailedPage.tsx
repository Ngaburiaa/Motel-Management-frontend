import { XCircle, ArrowLeft, RotateCcw, AlertTriangle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const PaymentFailedPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const sessionId = searchParams.get("session_id");

  const handleRetry = () => {
    if (sessionId) {
      navigate(`/checkout?session_id=${sessionId}`);
    } else {
      navigate("/checkout");
    }
  };

  const handleGoToBookings = () => {
    navigate("/bookings");
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full text-center space-y-6">
        <div className="flex justify-center">
          <XCircle className="text-red-500 w-16 h-16" strokeWidth={1.5} />
        </div>

        <h1 className="text-2xl font-bold text-gray-800">Payment Failed</h1>
        <p className="text-gray-600">
          We couldn't complete your payment. You can retry the payment below or go back to your bookings.
        </p>

        <div className="grid gap-4 pt-4">
          <button
            onClick={handleRetry}
            className="btn btn-outline btn-error flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Retry Payment
          </button>

          <button
            onClick={handleGoToBookings}
            className="btn btn-outline btn-primary flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Bookings
          </button>
        </div>

        <div className="pt-2 text-sm text-red-500 flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          If you've been charged, please contact support.
        </div>
      </div>
    </section>
  );
};
