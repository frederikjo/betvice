import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorMessageProps {
  title?: string;
  message?: string;
  retry?: boolean;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = "Data Unavailable",
  message = "We couldn't retrieve the data at this time. Please try again later.",
  retry = true,
  onRetry,
}) => {
  return (
    <Card className="bg-background w-full">
      <CardHeader className="flex flex-row items-center gap-2">
        <AlertCircle className="text-amber-500 w-5 h-5" />
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-muted-foreground">{message}</p>
          {retry && onRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ErrorMessage;
