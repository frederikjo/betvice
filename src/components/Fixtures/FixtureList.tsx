import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import sportsApi, {
  CommonLeague,
  SportsApiProvider,
} from "@/services/sports-api";
import RefreshButton from "../RefreshButton";

const FixtureList: React.FC = () => {
  const [leagues, setLeagues] = useState<CommonLeague[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false); // New state for refresh
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date()); // Track last update time
  // const [activeProvider, setActiveProvider] =
  //   useState<SportsApiProvider>(sportsApi.getActiveProvider());'
  const [activeProvider, setActiveProvider] =
    useState<SportsApiProvider>(() => {
      const provider = sportsApi.getActiveProvider();
      if (provider !== "sportmonks") {
        sportsApi.setProvider("sportmonks");
        return "sportmonks";
      }
      return provider;
    });
  const [activeTab, setActiveTab] = useState<"live" | "today">(
    "live"
  );

  useEffect(() => {
    fetchData();
  }, [activeProvider, activeTab]);

  // Modified to handle refresh
  const fetchData = async (isRefresh = false) => {
    try {
      // Different loading state for initial load vs. refresh
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Get today's date in YYYY-MM-DD format
      const today = format(new Date(), "yyyy-MM-dd");

      let response;
      if (activeTab === "live") {
        // The getLiveMatches method doesn't accept a refresh parameter in your API
        response = await sportsApi.football.getLiveMatches();
      } else {
        // The getMatchesByDate method only accepts a date parameter in your API
        response = await sportsApi.football.getMatchesByDate(today);
      }

      setLeagues(response);

      // Update the last updated timestamp on refresh
      if (isRefresh) {
        setLastUpdated(new Date());
      }

      // Reset loading states
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error(`Error fetching ${activeTab} fixtures:`, err);
      setError(
        `Failed to load ${activeTab} fixtures. Please try again later.`
      );
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  const handleProviderChange = (provider: SportsApiProvider) => {
    sportsApi.setProvider(provider);
    setActiveProvider(provider);
  };

  // New refresh handler
  const handleRefresh = () => {
    fetchData(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin w-6 h-6 text-blue-500" />
        <p className="ml-2 text-gray-700">
          Loading {activeTab} fixtures...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8 text-red-500">
        <AlertCircle className="w-6 h-6 mr-2" />
        <p>{error}</p>
        <RefreshButton
          onClick={handleRefresh}
          isRefreshing={refreshing}
          className="ml-4"
        />
      </div>
    );
  }

  if (leagues.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        <p>No {activeTab} fixtures available.</p>
        <RefreshButton
          onClick={handleRefresh}
          isRefreshing={refreshing}
          className="mx-auto mt-4"
          iconOnly={false}
        />
      </div>
    );
  }

  console.log("foo", sportsApi);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <span>{format(new Date(), "MMMM d, yyyy")}</span>
          <span className="ml-2 text-xs text-gray-500">
            Last updated: {format(lastUpdated, "HH:mm:ss")}
          </span>
        </div>

        <div className="flex space-x-2">
          {/* Data source selector */}
          <div className="p-1 text-xs bg-gray-100 rounded-md">
            <span className="mr-2">Provider:</span>
            <select
              value={activeProvider}
              onChange={(e) =>
                handleProviderChange(
                  e.target.value as SportsApiProvider
                )
              }
              className="px-2 py-1 text-sm bg-white border rounded"
            >
              {sportsApi.getAvailableProviders().map((provider) => (
                <option key={provider} value={provider}>
                  {provider === "theOddsApi"
                    ? "The Odds API"
                    : provider === "sportmonks"
                    ? "SportMonks"
                    : provider}
                </option>
              ))}
            </select>
          </div>

          {/* Tab selector */}
          <div className="flex overflow-hidden border rounded-md">
            <button
              onClick={() => setActiveTab("live")}
              className={`px-3 py-1 text-sm font-medium ${
                activeTab === "live"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              Live
            </button>
            <button
              onClick={() => setActiveTab("today")}
              className={`px-3 py-1 text-sm font-medium ${
                activeTab === "today"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              Today
            </button>
          </div>

          {/* Replace the custom refresh button with the RefreshButton component */}
          <RefreshButton
            onClick={handleRefresh}
            isRefreshing={refreshing}
            iconOnly={true}
          />
        </div>
      </div>

      {leagues.map((league) => (
        <div
          key={league.id}
          className="overflow-hidden border rounded-lg shadow-sm"
        >
          <div className="flex items-center px-4 py-3 bg-gray-100 border-b">
            {league.logo && (
              <img
                src={league.logo}
                alt={league.name}
                className="object-contain w-6 h-6 mr-2"
              />
            )}
            <div>
              <h3 className="font-semibold">{league.name}</h3>
              {league.country && (
                <p className="text-xs text-gray-600">
                  {league.country}
                </p>
              )}
            </div>
          </div>

          {Array.isArray(league.fixtures) &&
          league.fixtures.length > 0 ? (
            <div className="divide-y">
              {league.fixtures.map((fixture) => (
                <div
                  key={fixture.id}
                  className={`hover:bg-gray-50 px-4 py-3 ${
                    fixture.status.status === "live"
                      ? "bg-green-50"
                      : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">
                      {fixture.startTime
                        ? format(new Date(fixture.startTime), "HH:mm")
                        : "TBD"}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        fixture.status.status === "live"
                          ? "bg-green-200 text-green-800"
                          : fixture.status.status === "finished"
                          ? "bg-gray-200 text-gray-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {fixture.status.status.toUpperCase()}
                      {fixture.status.status === "live" &&
                        fixture.status.elapsed &&
                        ` ${fixture.status.elapsed}'`}
                    </span>
                  </div>

                  <div className="grid items-center grid-cols-7">
                    <div className="flex items-center col-span-3">
                      {fixture.homeTeam?.logo && (
                        <img
                          src={fixture.homeTeam.logo}
                          alt={fixture.homeTeam.name}
                          className="object-contain w-5 h-5 mr-2"
                        />
                      )}
                      <span className="text-sm truncate">
                        {fixture.homeTeam?.name || "Home Team"}
                      </span>
                    </div>

                    <div className="col-span-1 text-sm font-semibold text-center">
                      {fixture.status.status === "live" ||
                      fixture.status.status === "finished" ? (
                        <span
                          className={
                            fixture.status.status === "live"
                              ? "text-green-700"
                              : ""
                          }
                        >
                          {fixture.score.home} - {fixture.score.away}
                        </span>
                      ) : (
                        <span>vs</span>
                      )}
                    </div>

                    <div className="flex items-center justify-end col-span-3">
                      <span className="text-sm truncate">
                        {fixture.awayTeam?.name || "Away Team"}
                      </span>
                      {fixture.awayTeam?.logo && (
                        <img
                          src={fixture.awayTeam.logo}
                          alt={fixture.awayTeam.name}
                          className="object-contain w-5 h-5 ml-2"
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              <p>No fixtures available for this league</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FixtureList;
