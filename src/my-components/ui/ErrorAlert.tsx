import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ErrorAlertProps {
  message?: string;
  className?: string;
}

const DEFAULT_ERROR_MESSAGE =
  "Failed to load data. Please check your network connection and try again.";

export function ErrorAlert({ message, className }: ErrorAlertProps) {
  return (
    <Alert variant="destructive" className={className}>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{message ?? DEFAULT_ERROR_MESSAGE}</AlertDescription>
    </Alert>
  );
}
