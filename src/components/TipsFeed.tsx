import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import TipCard from "./TipCard";
import { fetchBTTSPicksFromSportMonks } from "@/services/bttsApiService";

interface Tip {
  id: string;
  matchTitle: string;
  teams: {
    home: string;
    away: string;
  };
  league: string;
  sport: string;
  date: string;
  time: string;
  odds: {
    value: number;
    movement: "up" | "down" | "stable";
  };
  confidence: number;
  prediction: string;
  recommended: boolean;
}

interface TipsFeedProps {
  sportFilter?: string;
  leagueFilter?: string;
  timeFrameFilter?: string;
}

const TipsFeed = ({
  sportFilter = "all",
  leagueFilter = "all",
  timeFrameFilter = "all",
}: TipsFeedProps) => {
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from real API
  useEffect(() => {
    setLoading(true);
    setPage(1);
    setError(null);

    const fetchData = async () => {
      try {
        // Fetch real data from SportMonks API
        const bttsData = await fetchBTTSPicksFromSportMonks();

        if (!bttsData.games.length) {
          setError("No tips available. Please try again later.");
          setTips([]);
          setHasMore(false);
          setLoading(false);
          return;
        }

        // Transform BTTS data to Tip format
        const transformedTips: Tip[] = bttsData.games.map(
          (game, index) => ({
            id: `btts-${index}`,
            matchTitle: `${game.home} vs ${game.away}`,
            teams: {
              home: game.home,
              away: game.away,
            },
            league: "Premier League", // This could be improved with more data from API
            sport: "Football",
            date: new Date().toISOString().split("T")[0], // Today's date
            time: game.kickoff,
            odds: {
              value: 1 / (game.probability / 100), // Convert probability to odds
              movement: Math.random() > 0.5 ? "up" : "down", // Random movement
            },
            confidence: game.probability,
            prediction: "Both Teams To Score",
            recommended: game.probability > 70, // Recommend if high probability
          })
        );

        setTips(transformedTips);
        setHasMore(false); // No pagination for now with real data
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tips:", error);
        setError("Failed to fetch tips. Please try again later.");
        setTips([]);
        setHasMore(false);
        setLoading(false);
      }
    };

    fetchData();
  }, [sportFilter, leagueFilter, timeFrameFilter]);

  // Load more function for infinite scroll (currently not used with real data)
  const loadMore = () => {
    if (loading || !hasMore) return;
    setLoading(true);

    // With real data, you would implement pagination here
    setLoading(false);
  };

  return (
    <div className="bg-background w-full">
      <div className="container px-4 py-6 mx-auto">
        {/* Tips count and sorting */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            {tips.length} Betting Tips Available
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-muted-foreground text-sm">
              Sort by:
            </span>
            <button className="bg-secondary flex items-center px-3 py-1 text-sm font-medium rounded-md">
              Confidence <ChevronDown className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

        {/* Tips grid */}
        {loading && tips.length === 0 ? (
          <div className="md:grid-cols-2 lg:grid-cols-3 grid grid-cols-1 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-[220px] rounded-xl border border-border bg-card animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <h3 className="text-lg font-medium">
              Error Loading Tips
            </h3>
            <p className="text-muted-foreground mt-2">{error}</p>
          </div>
        ) : tips.length > 0 ? (
          <div className="md:grid-cols-2 lg:grid-cols-3 grid grid-cols-1 gap-6">
            {tips.map((tip) => (
              <TipCard
                key={tip.id}
                matchTitle={tip.matchTitle}
                teams={tip.teams}
                league={tip.league}
                sportType={tip.sport}
                date={tip.date}
                time={tip.time}
                odds={{
                  value: tip.odds.value.toFixed(2),
                  movement: tip.odds.movement,
                }}
                confidenceRating={tip.confidence}
                tipType={tip.prediction}
                isRecommended={tip.recommended}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <h3 className="text-lg font-medium">
              No tips match your filters
            </h3>
            <p className="text-muted-foreground mt-2">
              Try adjusting your filters to see more results
            </p>
          </div>
        )}

        {/* Loading indicator */}
        {loading && tips.length > 0 && (
          <div className="flex justify-center mt-8">
            <div className="border-primary border-t-transparent animate-spin w-8 h-8 border-4 rounded-full" />
          </div>
        )}

        {/* Load more button (alternative to infinite scroll) */}
        {!loading && hasMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={loadMore}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 transition-colors rounded-md"
            >
              Load More Tips
            </button>
          </div>
        )}

        {/* End of results message */}
        {!loading && !hasMore && tips.length > 0 && (
          <div className="text-muted-foreground mt-8 text-center">
            You've reached the end of the tips
          </div>
        )}
      </div>
    </div>
  );
};

export default TipsFeed;
