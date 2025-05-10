import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import axios from "axios";
import {
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const ApiResponseDebug: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [expanded, setExpanded] = useState(false);

  const fetchApiData = async () => {
    setLoading(true);
    setError(null);

    try {
      const today = format(new Date(), "yyyy-MM-dd");
      const API_TOKEN = import.meta.env.VITE_SPORTMONKS_TOKEN;

      // Get the response directly with the token in the URL
      const response = await axios.get(
        `/api/sportmonks/football/leagues/date/${today}?api_token=${API_TOKEN}`
      );

      console.log("API Debug - Raw response:", response);
      setApiResponse(response.data);
    } catch (err: any) {
      console.error("API Debug - Error:", err);
      setError(err.message || "Failed to fetch API data");
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on mount
  useEffect(() => {
    fetchApiData();
  }, []);

  return (
    <div className="p-4 mb-6 bg-gray-100 border rounded-lg">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="text-lg font-semibold">
          API Response Debugger
        </h3>
        {expanded ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </div>

      {expanded && (
        <div className="mt-4">
          <div className="flex justify-between mb-4">
            <p className="text-sm text-gray-600">
              Viewing raw API response to help debug data structure
              issues
            </p>
            <button
              onClick={fetchApiData}
              disabled={loading}
              className="hover:bg-blue-600 disabled:opacity-50 px-3 py-1 text-sm text-white bg-blue-500 rounded"
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="animate-spin w-5 h-5 mr-2 text-blue-500" />
              <p>Loading API data...</p>
            </div>
          )}

          {error && (
            <div className="p-4 mb-4 text-red-700 bg-red-100 border-l-4 border-red-500">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                <p>{error}</p>
              </div>
            </div>
          )}

          {apiResponse && (
            <div className="mt-2">
              <p className="mb-2 text-sm font-medium">
                Response structure:
              </p>
              <div className="max-h-96 p-4 overflow-auto text-sm text-green-400 bg-gray-900 rounded">
                <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
              </div>

              {apiResponse.data && (
                <div className="mt-4">
                  <p className="mb-2 text-sm font-medium">
                    Data type:{" "}
                    {Array.isArray(apiResponse.data)
                      ? "Array"
                      : typeof apiResponse.data}
                  </p>
                  <p className="mb-2 text-sm font-medium">
                    Data length:{" "}
                    {Array.isArray(apiResponse.data)
                      ? apiResponse.data.length
                      : "N/A"}
                  </p>

                  {apiResponse.data &&
                    Array.isArray(apiResponse.data) &&
                    apiResponse.data.length > 0 && (
                      <div className="mt-2">
                        <p className="mb-2 text-sm font-medium">
                          First item sample:
                        </p>
                        <div className="max-h-48 p-4 overflow-auto text-sm text-green-400 bg-gray-900 rounded">
                          <pre>
                            {JSON.stringify(
                              apiResponse.data[0],
                              null,
                              2
                            )}
                          </pre>
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApiResponseDebug;
