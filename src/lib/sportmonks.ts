// src/services/sportmonksService.ts
import { config } from "../lib/config";
import type { BTTSGame } from "../lib/types";
import {
  fetchWithErrorHandling,
  logApiResponse,
} from "../lib/apiUtils";

const API_BASE = config.apiBase || "https://api.sportmonks.com/v3";
const API_TOKEN = config.sportmonksToken;

interface SportMonksResponse {
  data: {
    fixtures?: {
      data: any[];
    };
    // Include other response fields as needed
  };
}

// Mock data for fallback when API is unavailable
const mockBTTSGames: BTTSGame[] = [
  {
    home: "Arsenal",
    away: "Manchester United",
    kickoff: "15:00",
    probability: 75.5,
  },
  {
    home: "Barcelona",
    away: "Real Madrid",
    kickoff: "20:00",
    probability: 82.3,
  },
  {
    home: "Bayern Munich",
    away: "Borussia Dortmund",
    kickoff: "17:30",
    probability: 88.7,
  },
  {
    home: "AC Milan",
    away: "Juventus",
    kickoff: "19:45",
    probability: 70.2,
  },
];

/**
 * Fetch BTTS (Both Teams To Score) picks from SportMonks API
 */
export async function fetchBTTSPicks(): Promise<{
  games: BTTSGame[];
}> {
  // Check if we have an API token
  if (!API_TOKEN || API_TOKEN === "YOUR_API_TOKEN_HERE") {
    console.warn("No SportMonks API token found. Using mock data!");
    return { games: mockBTTSGames };
  }

  try {
    // URL for the specific round you want to fetch
    const url = `${API_BASE}/football/rounds/339269?include=fixtures.odds.market;fixtures.odds.bookmaker;fixtures.participants;league.country&filters=markets:14;bookmakers:2&api_token=${API_TOKEN}`;

    console.log("Fetching BTTS picks from SportMonks...");

    // Use our enhanced fetch function
    const data = await fetchWithErrorHandling<SportMonksResponse>(
      url
    ).then((response) => logApiResponse(response, "SportMonks BTTS"));

    // Process the data to extract BTTS games
    const games = processSportMonksData(data);

    return { games };
  } catch (error) {
    console.error(
      "Error fetching BTTS picks from SportMonks:",
      error
    );
    console.log("Using fallback mock data instead");
    return { games: mockBTTSGames };
  }
}

/**
 * Process the raw API data to extract BTTS games with probabilities
 */
function processSportMonksData(data: any): BTTSGame[] {
  const bttsGames: BTTSGame[] = [];

  if (!data?.data?.fixtures?.data) {
    console.log("No fixtures data found in API response");
    return bttsGames;
  }

  const fixtures = data.data.fixtures.data;

  fixtures.forEach((fixture: any) => {
    try {
      // Check if this fixture has participants
      if (
        !fixture.participants ||
        !Array.isArray(fixture.participants)
      ) {
        return;
      }

      // Extract home and away teams
      const homeTeam =
        fixture.participants.find(
          (p: any) => p.meta?.location === "home"
        )?.name || "Unknown Home";
      const awayTeam =
        fixture.participants.find(
          (p: any) => p.meta?.location === "away"
        )?.name || "Unknown Away";

      // Extract kickoff time
      const kickoff = fixture.starting_at
        ? new Date(fixture.starting_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "TBD";

      // Find BTTS market odds (market 14)
      if (!fixture.odds || !Array.isArray(fixture.odds.data)) {
        return;
      }

      // Look for the BTTS market
      const bttsOdds = fixture.odds.data.find((odd: any) => {
        return odd.market?.name
          ?.toLowerCase()
          .includes("both teams to score");
      });

      if (!bttsOdds) return;

      // Calculate probability from odds
      // The "Yes" option for BTTS is typically labeled as such
      const yesOption = bttsOdds.value?.find(
        (v: any) =>
          v.label?.toLowerCase() === "yes" ||
          v.label?.toLowerCase() === "both teams to score - yes"
      );

      if (!yesOption || !yesOption.value) return;

      // Convert decimal odds to probability (1/odds * 100)
      const oddsValue = parseFloat(yesOption.value);
      const probability = oddsValue ? (1 / oddsValue) * 100 : 0;

      // Only include fixtures with high probability of BTTS
      if (probability > 60) {
        bttsGames.push({
          home: homeTeam,
          away: awayTeam,
          kickoff,
          probability,
        });
      }
    } catch (err) {
      console.error("Error processing fixture:", err);
    }
  });

  // Sort by probability (highest first)
  return bttsGames.sort((a, b) => b.probability - a.probability);
}
