// src/lib/sportmonksDirectParser.ts
import { BTTSGame } from "./types";

/**
 * Process raw SportMonks JSON response to extract BTTS games
 * @param data Raw SportMonks response data
 * @returns Processed BTTS games
 */
export function processSportMonksData(data: any): {
  games: BTTSGame[];
} {
  const bttsGames: BTTSGame[] = [];

  try {
    // Check if fixtures exist in the response
    if (!data.fixtures || !Array.isArray(data.fixtures)) {
      console.warn("No fixtures found in SportMonks data");
      return { games: bttsGames };
    }

    // Process each fixture
    for (const fixture of data.fixtures) {
      try {
        // Skip if we don't have participants or odds
        if (!fixture.participants || !fixture.odds) {
          continue;
        }

        // Extract home and away teams
        let homeTeam: string | undefined;
        let awayTeam: string | undefined;

        for (const participant of fixture.participants) {
          if (participant.meta?.location === "home") {
            homeTeam = participant.name;
          } else if (participant.meta?.location === "away") {
            awayTeam = participant.name;
          }
        }

        // Skip if we couldn't find both teams
        if (!homeTeam || !awayTeam) {
          continue;
        }

        // Extract kickoff time
        let kickoff = "TBD";
        if (fixture.starting_at) {
          const startDate = new Date(fixture.starting_at);
          kickoff = startDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
        }

        // Find BTTS odds (looking for "Yes" option)
        let bttsYesOdds: any = null;

        for (const odd of fixture.odds) {
          if (odd.market_id === 14 && odd.label === "Yes") {
            bttsYesOdds = odd;
            break;
          }
        }

        // Skip if no BTTS Yes odds found
        if (!bttsYesOdds) {
          continue;
        }

        // Calculate probability from the value
        const oddsValue = parseFloat(bttsYesOdds.value);
        const probability = oddsValue
          ? Math.round((1 / oddsValue) * 100)
          : 0;

        // Add to our games list
        bttsGames.push({
          home: homeTeam,
          away: awayTeam,
          kickoff,
          probability,
        });
      } catch (error) {
        console.error("Error processing fixture:", error);
      }
    }

    // Sort games by probability (highest first)
    bttsGames.sort((a, b) => b.probability - a.probability);

    return { games: bttsGames };
  } catch (error) {
    console.error("Error processing SportMonks data:", error);
    return { games: bttsGames };
  }
}

/**
 * Process mock SportMonks data for testing
 * @returns Processed BTTS games
 */
export function processMockSportMonksData(): { games: BTTSGame[] } {
  try {
    // Mock data based on the provided JSON structure
    const mockData = {
      fixtures: [
        {
          id: 19135003,
          name: "Liverpool vs Tottenham Hotspur",
          starting_at: "2025-04-27 15:30:00",
          odds: [
            {
              id: 167876622322,
              market_id: 14,
              bookmaker_id: 2,
              label: "No",
              value: "2.05",
            },
            {
              id: 167876622321,
              market_id: 14,
              bookmaker_id: 2,
              label: "Yes",
              value: "1.70",
            },
          ],
          participants: [
            {
              id: 8,
              name: "Liverpool",
              meta: {
                location: "home",
              },
            },
            {
              id: 6,
              name: "Tottenham Hotspur",
              meta: {
                location: "away",
              },
            },
          ],
        },
        {
          id: 19135004,
          name: "Manchester City vs Aston Villa",
          starting_at: "2025-04-22 19:00:00",
          odds: [
            {
              id: 167876513609,
              market_id: 14,
              bookmaker_id: 2,
              label: "No",
              value: "2.37",
            },
            {
              id: 167876513608,
              market_id: 14,
              bookmaker_id: 2,
              label: "Yes",
              value: "1.53",
            },
          ],
          participants: [
            {
              id: 9,
              name: "Manchester City",
              meta: {
                location: "home",
              },
            },
            {
              id: 15,
              name: "Aston Villa",
              meta: {
                location: "away",
              },
            },
          ],
        },
        {
          id: 19135001,
          name: "Brighton & Hove Albion vs West Ham United",
          starting_at: "2025-04-26 14:00:00",
          odds: [
            {
              id: 167876620220,
              market_id: 14,
              bookmaker_id: 2,
              label: "No",
              value: "2.10",
            },
            {
              id: 167876620219,
              market_id: 14,
              bookmaker_id: 2,
              label: "Yes",
              value: "1.66",
            },
          ],
          participants: [
            {
              id: 78,
              name: "Brighton & Hove Albion",
              meta: {
                location: "home",
              },
            },
            {
              id: 1,
              name: "West Ham United",
              meta: {
                location: "away",
              },
            },
          ],
        },
      ],
    };

    // Process the mock data
    return processSportMonksData(mockData);
  } catch (error) {
    console.error("Error processing mock data:", error);
    return { games: [] };
  }
}
