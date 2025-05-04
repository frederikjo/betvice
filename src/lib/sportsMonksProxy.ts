// src/lib/sportmonksWithProxy.ts
import { BTTSGame } from "./types";

// Mock data as fallback
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
];

/**
 * Fetch BTTS picks from SportMonks API through a CORS proxy
 */
export async function fetchBTTSPicksFromSportMonks(): Promise<{
  games: BTTSGame[];
}> {
  // Get your SportMonks API token from environment
  const API_TOKEN = import.meta.env.VITE_SPORTMONKS_TOKEN;

  if (!API_TOKEN) {
    console.error(
      "SportMonks API token is missing! Add VITE_SPORTMONKS_TOKEN to your .env file"
    );
    return { games: mockBTTSGames };
  }

  try {
    // Option 1: Use a public CORS proxy (not recommended for production)
    // const CORS_PROXY = "https://corsproxy.io/?";

    // Option 2: Local development proxy via Vite (recommended)
    // This works if you've set up a proxy in your vite.config.js
    const PROXY_PATH = "/api/sportmonks";

    // Build the URL
    // If using public proxy: const url = `${CORS_PROXY}https://api.sportmonks.com/v3/football/rounds/339269?include=fixtures...`;
    // If using Vite proxy:
    const url = `${PROXY_PATH}/football/rounds/339269?include=fixtures.odds.market;fixtures.odds.bookmaker;fixtures.participants;league.country&filters=markets:14;bookmakers:2&api_token=${API_TOKEN}`;

    console.log("Calling SportMonks API through proxy...");

    // Make the API call
    const response = await fetch(url);

    // Check for errors
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `SportMonks API error (${response.status}): ${errorText}`
      );
    }

    // Parse the JSON response
    const data = await response.json();
    console.log("SportMonks API response received successfully");

    // Extract fixtures from the response
    const fixtures = data?.data?.fixtures?.data || [];

    if (!fixtures.length) {
      console.warn(
        "No fixtures found in the SportMonks API response"
      );
      return { games: mockBTTSGames };
    }

    console.log(`Found ${fixtures.length} fixtures in the response`);

    // Process fixtures to extract BTTS games
    const bttsGames: BTTSGame[] = [];

    fixtures.forEach((fixture: any) => {
      try {
        // Check if this fixture has the necessary data
        if (
          !fixture.participants ||
          !Array.isArray(fixture.participants) ||
          !fixture.odds?.data
        ) {
          return;
        }

        // Extract teams
        const homeTeam = fixture.participants.find(
          (p: any) => p.meta?.location === "home"
        )?.name;
        const awayTeam = fixture.participants.find(
          (p: any) => p.meta?.location === "away"
        )?.name;

        if (!homeTeam || !awayTeam) {
          return;
        }

        // Extract kickoff time
        const kickoff = fixture.starting_at
          ? new Date(fixture.starting_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "TBD";

        // Find BTTS odds
        const bttsMarket = fixture.odds.data.find((odd: any) =>
          odd.market?.name
            ?.toLowerCase()
            .includes("both teams to score")
        );

        if (!bttsMarket || !bttsMarket.values?.data) {
          return;
        }

        // Find the "Yes" option
        const yesOption = bttsMarket.values.data.find(
          (v: any) =>
            v.value_id === 1 || v.value?.name?.toLowerCase() === "yes"
        );

        if (!yesOption || !yesOption.odds) {
          return;
        }

        // Calculate probability (1/odds * 100)
        const odds = parseFloat(yesOption.odds);
        const probability = odds ? Math.round((1 / odds) * 100) : 0;

        // Add to our list if probability is significant
        if (probability > 0) {
          bttsGames.push({
            home: homeTeam,
            away: awayTeam,
            kickoff,
            probability,
          });
        }
      } catch (error) {
        console.error("Error processing fixture:", error);
      }
    });

    // Sort by probability (highest first)
    bttsGames.sort((a, b) => b.probability - a.probability);

    console.log(
      `Successfully processed ${bttsGames.length} BTTS games`
    );

    // Return the processed games, or fallback to mock data if none found
    return {
      games: bttsGames.length > 0 ? bttsGames : mockBTTSGames,
    };
  } catch (error) {
    console.error("Error fetching from SportMonks:", error);
    return { games: mockBTTSGames };
  }
}
