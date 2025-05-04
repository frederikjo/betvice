import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { AlertCircle } from "lucide-react";

interface NoDataMessageProps {
  title?: string;
  message?: string;
  actionText?: string;
  onAction?: () => void;
}

const NoDataMessage: React.FC<NoDataMessageProps> = ({
  title = "No Data Available",
  message = "We couldn't retrieve the data at this time. This may be due to an API configuration issue or service unavailability.",
  actionText = "Configure API",
  onAction,
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
          {onAction && (
            <Button onClick={onAction} variant="outline" size="sm">
              {actionText}
            </Button>
          )}
          <div className="bg-muted/30 p-4 text-sm rounded-md">
            <h4 className="mb-2 font-medium">Quick Setup Guide:</h4>
            <ol className="pl-4 space-y-1 list-decimal">
              <li>
                Sign up for a SportMonks API account at{" "}
                <a
                  href="https://sportmonks.com/register"
                  className="text-primary underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  sportmonks.com
                </a>
              </li>
              <li>Obtain your API token from the dashboard</li>
              <li>
                Create a{" "}
                <code className="bg-muted px-1 rounded">.env</code>{" "}
                file in your project root
              </li>
              <li>
                Add{" "}
                <code className="bg-muted px-1 rounded">
                  VITE_SPORTMONKS_TOKEN=your_token_here
                </code>{" "}
                to the file
              </li>
              <li>Restart your development server</li>
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoDataMessage;
