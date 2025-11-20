import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";

interface ErrorProps {
  message?: string;
  showRetry?: boolean;
  onRetry?: () => void;
}

export const Error = ({
  message = "Something went wrong.",
  showRetry = false,
  onRetry,
}: ErrorProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] px-6 text-center">
      <div className="mb-4">
        <AlertTriangle className="w-10 h-10 text-red-600" />
      </div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">An Error Occurred</h1>
      <p className="text-gray-600 mb-6 max-w-md">{message}</p>
      <div className="flex flex-wrap justify-center gap-3">
        {showRetry && onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            className="border-red-600 text-red-600 hover:bg-red-50"
          >
            Retry
          </Button>
        )}
        <Button onClick={() => navigate("/")}>Go Home</Button>
      </div>
    </div>
  );
};

