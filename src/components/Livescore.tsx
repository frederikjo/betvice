import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Loader2, RefreshCw, AlertCircle } from "lucide-react";
import apiService, { Fixture } from "@/services/api";

const LivescoreDashboard: React.FC = () => {
  const [livescores, setLivescores] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Function to fetch livescores
  const fetchLivescores = async () => {
    try {
      setLoading(true);

      // Using our API service to get livescores
      const response =
        await apiService.sportmonks.football.getLivescores();

      if (response && response.data) {
        setLivescores(response.data);
        setLastUpdated(new Date());
      }

      setLoading(false);
      setError(null);
    } catch (err) {
      console.error("Error fetching livescores:", err);
      setError("Failed to load livescores. Please try again.");
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchLivescores();

    // Set up auto-refresh every 60 seconds
    const intervalId = setInterval(() => {
      fetchLivescores();
    }, 60000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Manual refresh handler
  const handleRefresh = () => {
    fetchLivescores();
  };

  if (loading && livescores.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin w-6 h-6 text-blue-500" />
        <p className="ml-2 text-gray-700">Loading livescores...</p>
      </div>
    );
  }

  if (error && livescores.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-red-500">
        <AlertCircle className="w-6 h-6 mr-2" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Live Matches</h2>
        <div className="flex items-center space-x-4">
          <p className="text-sm text-gray-500">
            Last updated: {format(lastUpdated, "HH:mm:ss")}
          </p>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="hover:bg-gray-100 p-2 transition-colors rounded-full"
            aria-label="Refresh livescores"
          >
            <RefreshCw
              className={`w-5 h-5 ${
                loading
                  ? "animate-spin text-blue-500"
                  : "text-gray-600"
              }`}
            />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 flex items-center p-3 text-sm text-red-700 rounded-md">
          <AlertCircle className="w-4 h-4 mr-2" />
          {error}
        </div>
      )}

      {livescores.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          <p>No live matches at the moment.</p>
        </div>
      ) : (
        <div className="overflow-hidden border divide-y rounded-lg shadow-sm">
          {livescores.map((fixture) => (
            <div key={fixture.id} className="hover:bg-gray-50 p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="px-2 py-1 text-xs text-white bg-green-600 rounded-full">
                  {fixture.status}
                </span>
              </div>

              <div className="grid items-center grid-cols-7 gap-2">
                <div className="flex items-center col-span-3">
                  {fixture.participants[0]?.image_path && (
                    <img
                      src={fixture.participants[0].image_path}
                      alt={fixture.participants[0].name}
                      className="object-contain w-6 h-6 mr-2"
                    />
                  )}
                  <span className="font-medium">
                    {fixture.participants[0]?.name}
                  </span>
                </div>

                <div className="col-span-1 font-bold text-center">
                  {fixture.scores ? (
                    <span className="px-3 py-1 bg-gray-100 rounded-md">
                      {fixture.scores.home_score} -{" "}
                      {fixture.scores.away_score}
                    </span>
                  ) : (
                    <span>vs</span>
                  )}
                </div>

                <div className="flex items-center justify-end col-span-3">
                  <span className="font-medium">
                    {fixture.participants[1]?.name}
                  </span>
                  {fixture.participants[1]?.image_path && (
                    <img
                      src={fixture.participants[1].image_path}
                      alt={fixture.participants[1].name}
                      className="object-contain w-6 h-6 ml-2"
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LivescoreDashboard;
