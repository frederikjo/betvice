import React from "react";
import { Loader2, RefreshCw } from "lucide-react";

interface RefreshButtonProps {
  onClick: () => void;
  isRefreshing: boolean;
  className?: string;
  iconOnly?: boolean;
}

/**
 * A reusable refresh button component with loading state
 */
const RefreshButton: React.FC<RefreshButtonProps> = ({
  onClick,
  isRefreshing,
  className = "",
  iconOnly = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isRefreshing}
      className={`flex items-center ${
        iconOnly
          ? "p-1.5 bg-gray-100 rounded-md hover:bg-gray-200"
          : "px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
      } disabled:opacity-50 transition-colors ${className}`}
      title="Refresh data"
    >
      {isRefreshing ? (
        <>
          <Loader2
            className={`${
              iconOnly ? "w-5 h-5" : "w-4 h-4 mr-1.5"
            } animate-spin text-blue-500`}
          />
          {!iconOnly && <span>Updating...</span>}
        </>
      ) : (
        <>
          <RefreshCw
            className={`${iconOnly ? "w-5 h-5" : "w-4 h-4 mr-1.5"} ${
              iconOnly ? "text-gray-600" : "text-blue-500"
            }`}
          />
          {!iconOnly && <span>Refresh</span>}
        </>
      )}
    </button>
  );
};

export default RefreshButton;
