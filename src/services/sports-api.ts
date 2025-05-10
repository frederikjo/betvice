import apiService from "./api";

// Type definitions
export type SportsApiProvider = "theOddsApi" | "sportmonks";

export interface CommonLeague {
  id: string | number;
  name: string;
  country?: string;
  logo?: string;
  fixtures: CommonFixture[];
}

export interface CommonFixture {
  id: string | number;
  homeTeam: {
    id: string | number;
    name: string;
    logo?: string;
  };
  awayTeam: {
    id: string | number;
    name: string;
    logo?: string;
  };
  startTime: string;
  status: {
    status: "live" | "finished" | "upcoming" | string;
    elapsed?: number;
  };
  score: {
    home: number | null;
    away: number | null;
  };
}

// Track the current provider
let currentProvider: SportsApiProvider = "theOddsApi";

// Sports API wrapper that provides consistent data across different providers
const sportsApi = {
  // Provider management
  getActiveProvider: (): SportsApiProvider => currentProvider,

  setProvider: (provider: SportsApiProvider): void => {
    currentProvider = provider;
  },

  getAvailableProviders: (): SportsApiProvider[] => {
    return ["theOddsApi", "sportmonks"];
  },

  // Football (soccer) API methods
  football: {
    // Get matches for a specific date
    getMatchesByDate: async (
      date: string,
      refresh = false
    ): Promise<CommonLeague[]> => {
      try {
        if (currentProvider === "sportmonks") {
          // Use SportMonks API
          const response =
            await apiService.sportmonks.football.getFixturesByDate(
              date,
              refresh
            );

          // Map the response to common format
          return mapSportMonksLeaguesToCommon(response.data);
        } else if (currentProvider === "theOddsApi") {
          // Implement TheOddsAPI calls here when they're available
          console.warn("TheOddsAPI implementation not available yet");
          // Return empty array for no data
          return [];
        }

        // Default empty return if no valid provider
        return [];
      } catch (error) {
        console.error("Error in getMatchesByDate:", error);
        // Return empty array on error
        return [];
      }
    },

    // Get live matches
    getLiveMatches: async (
      refresh = false
    ): Promise<CommonLeague[]> => {
      try {
        if (currentProvider === "sportmonks") {
          // Use SportMonks API for live data
          const response =
            await apiService.sportmonks.football.getInplayLivescores(
              refresh
            );

          // Group fixtures by league and map to common format
          return groupAndMapSportMonksFixturesToLeagues(
            response.data
          );
        } else if (currentProvider === "theOddsApi") {
          // Implement TheOddsAPI calls here when they're available
          console.warn("TheOddsAPI implementation not available yet");
          // Return empty array for no data
          return [];
        }

        // Default empty return if no valid provider
        return [];
      } catch (error) {
        console.error("Error in getLiveMatches:", error);
        // Return empty array on error
        return [];
      }
    },
  },
};

// Helper functions to map data from different providers to a common format
function mapSportMonksLeaguesToCommon(
  leagues: any[]
): CommonLeague[] {
  if (!Array.isArray(leagues) || leagues.length === 0) {
    return [];
  }

  return leagues.map((league) => ({
    id: league.id,
    name: league.name,
    country: league.country?.name,
    logo: league.image_path,
    fixtures: Array.isArray(league.today)
      ? league.today.map((fixture: any) =>
          mapSportMonksFixtureToCommon(fixture)
        )
      : [],
  }));
}

function mapSportMonksFixtureToCommon(fixture: any): CommonFixture {
  // Extract teams from participants array
  const homeTeam = fixture.participants?.find(
    (p: any) => p.meta?.location === "home"
  );
  const awayTeam = fixture.participants?.find(
    (p: any) => p.meta?.location === "away"
  );

  // Map periods to get scores
  const scoreData = fixture.scores || [];
  const homeScore = scoreData.find(
    (s: any) => s.participant_id === homeTeam?.id && s.type_id === 1
  )?.score;
  const awayScore = scoreData.find(
    (s: any) => s.participant_id === awayTeam?.id && s.type_id === 1
  )?.score;

  // Map fixture status to common format
  let status = "upcoming";
  let elapsed = undefined;

  if (fixture.state?.state === "inplay") {
    status = "live";
    elapsed = fixture.periods?.find(
      (p: any) => p.type_id === 1
    )?.elapsed;
  } else if (
    ["finished", "completed"].includes(fixture.state?.state)
  ) {
    status = "finished";
  }

  return {
    id: fixture.id,
    homeTeam: {
      id: homeTeam?.id || 0,
      name: homeTeam?.name || "Unknown Team",
      logo: homeTeam?.image_path,
    },
    awayTeam: {
      id: awayTeam?.id || 0,
      name: awayTeam?.name || "Unknown Team",
      logo: awayTeam?.image_path,
    },
    startTime: fixture.starting_at,
    status: {
      status,
      elapsed,
    },
    score: {
      home: homeScore !== undefined ? Number(homeScore) : null,
      away: awayScore !== undefined ? Number(awayScore) : null,
    },
  };
}

function groupAndMapSportMonksFixturesToLeagues(
  fixtures: any[]
): CommonLeague[] {
  if (!Array.isArray(fixtures) || fixtures.length === 0) {
    return [];
  }

  // Group fixtures by league
  const leagueMap = new Map<number, any>();

  fixtures.forEach((fixture) => {
    if (!fixture.league) return;

    const leagueId = fixture.league.id;
    if (!leagueMap.has(leagueId)) {
      leagueMap.set(leagueId, {
        id: leagueId,
        name: fixture.league.name,
        country: fixture.league.country?.name,
        logo: fixture.league.image_path,
        fixtures: [],
      });
    }

    leagueMap
      .get(leagueId)
      .fixtures.push(mapSportMonksFixtureToCommon(fixture));
  });

  return Array.from(leagueMap.values());
}

export default sportsApi;
