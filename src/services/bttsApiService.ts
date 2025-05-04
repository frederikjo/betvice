import { BTTSGame } from "@/lib/types";

/**
 * Fetch BTTS picks from SportMonks API via proxy
 */
export async function fetchBTTSPicksFromSportMonks(): Promise<{
  games: BTTSGame[];
}> {
  // Get your SportMonks API token from environment variable
  const API_TOKEN = import.meta.env.VITE_SPORTMONKS_TOKEN;

  if (!API_TOKEN) {
    console.error(
      "SportMonks API token is missing! Add VITE_SPORTMONKS_TOKEN to your .env file"
    );
    return { games: [] };
  }

  try {
    // Use the proxy URL (configured in vite.config.ts)
    const url = `/api/sportmonks/football/rounds/339269?include=fixtures.odds.market;fixtures.odds.bookmaker;fixtures.participants;league.country&filters=markets:14;bookmakers:2&api_token=${API_TOKEN}`;

    console.log("Calling SportMonks API via proxy...");

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
      return { games: [] };
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

    // Return the processed games
    return { games: bttsGames };
  } catch (error) {
    console.error("Error fetching from SportMonks:", error);
    return { games: [] };
  }
}
