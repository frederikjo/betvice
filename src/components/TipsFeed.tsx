import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import TipCard from "./TipCard";

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

  // Mock data for demonstration
  const mockTips: Tip[] = [
    {
      id: "1",
      matchTitle: "Premier League",
      teams: {
        home: "Arsenal",
        away: "Manchester United",
      },
      league: "Premier League",
      sport: "Football",
      date: "2023-06-15",
      time: "15:00",
      odds: {
        value: 1.85,
        movement: "up",
      },
      confidence: 85,
      prediction: "Home Win",
      recommended: true,
    },
    {
      id: "2",
      matchTitle: "La Liga",
      teams: {
        home: "Barcelona",
        away: "Real Madrid",
      },
      league: "La Liga",
      sport: "Football",
      date: "2023-06-16",
      time: "20:00",
      odds: {
        value: 2.1,
        movement: "down",
      },
      confidence: 70,
      prediction: "Draw",
      recommended: false,
    },
    {
      id: "3",
      matchTitle: "NBA Playoffs",
      teams: {
        home: "Boston Celtics",
        away: "Miami Heat",
      },
      league: "NBA",
      sport: "Basketball",
      date: "2023-06-15",
      time: "19:30",
      odds: {
        value: 1.65,
        movement: "stable",
      },
      confidence: 90,
      prediction: "Over 210.5 Points",
      recommended: true,
    },
    {
      id: "4",
      matchTitle: "Serie A",
      teams: {
        home: "Juventus",
        away: "AC Milan",
      },
      league: "Serie A",
      sport: "Football",
      date: "2023-06-17",
      time: "18:45",
      odds: {
        value: 1.95,
        movement: "up",
      },
      confidence: 75,
      prediction: "Away Win",
      recommended: false,
    },
    {
      id: "5",
      matchTitle: "Bundesliga",
      teams: {
        home: "Bayern Munich",
        away: "Borussia Dortmund",
      },
      league: "Bundesliga",
      sport: "Football",
      date: "2023-06-18",
      time: "17:30",
      odds: {
        value: 1.55,
        movement: "down",
      },
      confidence: 88,
      prediction: "Home Win & Over 2.5",
      recommended: true,
    },
    {
      id: "6",
      matchTitle: "ATP French Open",
      teams: {
        home: "Rafael Nadal",
        away: "Novak Djokovic",
      },
      league: "ATP",
      sport: "Tennis",
      date: "2023-06-16",
      time: "14:00",
      odds: {
        value: 2.25,
        movement: "stable",
      },
      confidence: 65,
      prediction: "Over 3.5 Sets",
      recommended: false,
    },
  ];

  // Simulate fetching data with filters
  useEffect(() => {
    setLoading(true);
    setPage(1);

    // Simulate API call with delay
    const timer = setTimeout(() => {
      let filteredTips = [...mockTips];

      // Apply filters
      if (sportFilter !== "all") {
        filteredTips = filteredTips.filter((tip) => tip.sport === sportFilter);
      }

      if (leagueFilter !== "all") {
        filteredTips = filteredTips.filter(
          (tip) => tip.league === leagueFilter,
        );
      }

      if (timeFrameFilter !== "all") {
        // Simple time frame filter for demo purposes
        const today = new Date().toISOString().split("T")[0];
        if (timeFrameFilter === "today") {
          filteredTips = filteredTips.filter((tip) => tip.date === today);
        } else if (timeFrameFilter === "tomorrow") {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          const tomorrowStr = tomorrow.toISOString().split("T")[0];
          filteredTips = filteredTips.filter((tip) => tip.date === tomorrowStr);
        }
      }

      setTips(filteredTips);
      setHasMore(filteredTips.length >= 6); // For demo, assume more if we have 6 or more
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [sportFilter, leagueFilter, timeFrameFilter]);

  // Load more function for infinite scroll
  const loadMore = () => {
    if (loading || !hasMore) return;

    setLoading(true);

    // Simulate loading more data
    setTimeout(() => {
      // In a real app, you would fetch the next page of data
      // For demo, we'll just duplicate existing tips with new IDs
      const newTips = tips.map((tip) => ({
        ...tip,
        id: `${tip.id}-${page}`,
      }));

      setTips([...tips, ...newTips]);
      setPage(page + 1);
      setHasMore(page < 3); // Limit to 3 pages for demo
      setLoading(false);
    }, 800);
  };

  // Detect when user scrolls near bottom to trigger loadMore
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 500 &&
        !loading &&
        hasMore
      ) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  return (
    <div className="w-full bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Tips count and sorting */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {tips.length} Betting Tips Available
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <button className="flex items-center text-sm font-medium bg-secondary px-3 py-1 rounded-md">
              Confidence <ChevronDown className="ml-1 h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tips grid */}
        {loading && tips.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-[220px] rounded-xl border border-border bg-card animate-pulse"
              />
            ))}
          </div>
        ) : tips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tips.map((tip) => (
              <TipCard key={tip.id} tip={tip} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No tips match your filters</h3>
            <p className="text-muted-foreground mt-2">
              Try adjusting your filters to see more results
            </p>
          </div>
        )}

        {/* Loading indicator */}
        {loading && tips.length > 0 && (
          <div className="flex justify-center mt-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Load more button (alternative to infinite scroll) */}
        {!loading && hasMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={loadMore}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Load More Tips
            </button>
          </div>
        )}

        {/* End of results message */}
        {!loading && !hasMore && tips.length > 0 && (
          <div className="text-center mt-8 text-muted-foreground">
            You've reached the end of the tips
          </div>
        )}
      </div>
    </div>
  );
};

export default TipsFeed;
