// src/services/sports-api/providers/the-odds-api.ts
import axios from "axios";
import {
  CommonLeague,
  CommonFixture,
  CommonPlayerStat,
} from "../index";

const theOddsApiProvider = {
  football: {
    getLiveMatches: async (config: any): Promise<CommonLeague[]> => {
      try {
        // The Odds API doesn't have a dedicated live scores endpoint,
        // so we'll get upcoming matches with 'in_play=true'
        const response = await axios.get(
          `${config.baseUrl}/sports/soccer/odds`,
          {
            params: {
              apiKey: config.apiKey,
              regions: "us",
              markets: "h2h",
              dateFormat: "iso",
              inPlay: "true",
            },
          }
        );

        // Transform The Odds API response to common format
        const events = response.data || [];
        const leaguesMap: { [key: string]: CommonLeague } = {};

        events.forEach((event: any) => {
          // Extract league information from the sport title
          const sportKey = event.sport_key || "";

          if (!leaguesMap[sportKey]) {
            leaguesMap[sportKey] = {
              id: sportKey,
              name: event.sport_title || "Soccer",
              fixtures: [],
            };
          }

          // The Odds API doesn't provide score information directly,
          // so we'll set default scores
          const commonFixture: CommonFixture = {
            id: event.id || "",
            homeTeam: {
              id: event.home_team,
              name: event.home_team || "Home Team",
            },
            awayTeam: {
              id: event.away_team,
              name: event.away_team || "Away Team",
            },
            score: {
              home: 0, // Default, The Odds API doesn't provide scores
              away: 0, // Default, The Odds API doesn't provide scores
            },
            startTime: event.commence_time || "",
            status: {
              status: "live", // Since we requested inPlay=true
            },
            league: {
              id: sportKey,
              name: event.sport_title || "Soccer",
            },
          };

          leaguesMap[sportKey].fixtures.push(commonFixture);
        });

        return Object.values(leaguesMap);
      } catch (error) {
        console.error(
          "Error fetching live matches from The Odds API:",
          error
        );
        throw error;
      }
    },

    getMatchesByDate: async (
      config: any,
      date: string
    ): Promise<CommonLeague[]> => {
      try {
        // The Odds API doesn't support filtering by date directly,
        // we'll get all upcoming events and filter client-side
        const response = await axios.get(
          `${config.baseUrl}/sports/soccer/odds`,
          {
            params: {
              apiKey: config.apiKey,
              regions: "us",
              markets: "h2h",
              dateFormat: "iso",
            },
          }
        );

        // Get the date in ISO format for comparison
        const targetDate = new Date(date);
        const targetDateStr = targetDate.toISOString().split("T")[0];

        // Transform The Odds API response to common format
        const events = response.data || [];
        const leaguesMap: { [key: string]: CommonLeague } = {};

        events.forEach((event: any) => {
          // Check if the event is on the target date
          const eventDate = new Date(event.commence_time);
          const eventDateStr = eventDate.toISOString().split("T")[0];

          if (eventDateStr === targetDateStr) {
            // Extract league information from the sport title
            const sportKey = event.sport_key || "";

            if (!leaguesMap[sportKey]) {
              leaguesMap[sportKey] = {
                id: sportKey,
                name: event.sport_title || "Soccer",
                fixtures: [],
              };
            }

            // The Odds API doesn't provide score information directly,
            // so we'll set default scores
            const commonFixture: CommonFixture = {
              id: event.id || "",
              homeTeam: {
                id: event.home_team,
                name: event.home_team || "Home Team",
              },
              awayTeam: {
                id: event.away_team,
                name: event.away_team || "Away Team",
              },
              score: {
                home: 0, // Default, The Odds API doesn't provide scores
                away: 0, // Default, The Odds API doesn't provide scores
              },
              startTime: event.commence_time || "",
              status: {
                status: "upcoming", // Since we're filtering by date, most will be upcoming
              },
              league: {
                id: sportKey,
                name: event.sport_title || "Soccer",
              },
            };

            leaguesMap[sportKey].fixtures.push(commonFixture);
          }
        });

        return Object.values(leaguesMap);
      } catch (error) {
        console.error(
          "Error fetching matches by date from The Odds API:",
          error
        );
        throw error;
      }
    },

    getPlayerStats: async (
      config: any,
      playerId: string
    ): Promise<CommonPlayerStat> => {
      // The Odds API doesn't support player stats directly
      // Returning a placeholder - you could implement this with another API
      return {
        playerId,
        playerName: "Player information not available",
        teamId: "",
        teamName: "Team information not available",
        stats: {},
      };
    },
  },

  // Implement basketball methods
  basketball: {
    getLiveGames: async (config: any): Promise<CommonLeague[]> => {
      try {
        const response = await axios.get(
          `${config.baseUrl}/sports/basketball_nba/odds`,
          {
            params: {
              apiKey: config.apiKey,
              regions: "us",
              markets: "h2h",
              dateFormat: "iso",
              inPlay: "true",
            },
          }
        );

        // Transform response to common format (similar to football)
        const events = response.data || [];
        const nbaLeague: CommonLeague = {
          id: "basketball_nba",
          name: "NBA",
          fixtures: [],
        };

        events.forEach((event: any) => {
          const commonFixture: CommonFixture = {
            id: event.id || "",
            homeTeam: {
              id: event.home_team,
              name: event.home_team || "Home Team",
            },
            awayTeam: {
              id: event.away_team,
              name: event.away_team || "Away Team",
            },
            score: {
              home: 0, // Default, The Odds API doesn't provide scores
              away: 0, // Default, The Odds API doesn't provide scores
            },
            startTime: event.commence_time || "",
            status: {
              status: "live", // Since we requested inPlay=true
            },
            league: {
              id: "basketball_nba",
              name: "NBA",
            },
          };

          nbaLeague.fixtures.push(commonFixture);
        });

        return nbaLeague.fixtures.length > 0 ? [nbaLeague] : [];
      } catch (error) {
        console.error(
          "Error fetching live NBA games from The Odds API:",
          error
        );
        throw error;
      }
    },

    getGamesByDate: async (
      config: any,
      date: string
    ): Promise<CommonLeague[]> => {
      // Implement similar to football getMatchesByDate but for basketball_nba
      try {
        const response = await axios.get(
          `${config.baseUrl}/sports/basketball_nba/odds`,
          {
            params: {
              apiKey: config.apiKey,
              regions: "us",
              markets: "h2h",
              dateFormat: "iso",
            },
          }
        );

        // Filter by date as in the football method
        const targetDate = new Date(date);
        const targetDateStr = targetDate.toISOString().split("T")[0];

        const events = response.data || [];
        const nbaLeague: CommonLeague = {
          id: "basketball_nba",
          name: "NBA",
          fixtures: [],
        };

        events.forEach((event: any) => {
          const eventDate = new Date(event.commence_time);
          const eventDateStr = eventDate.toISOString().split("T")[0];

          if (eventDateStr === targetDateStr) {
            const commonFixture: CommonFixture = {
              id: event.id || "",
              homeTeam: {
                id: event.home_team,
                name: event.home_team || "Home Team",
              },
              awayTeam: {
                id: event.away_team,
                name: event.away_team || "Away Team",
              },
              score: {
                home: 0,
                away: 0,
              },
              startTime: event.commence_time || "",
              status: {
                status: "upcoming",
              },
              league: {
                id: "basketball_nba",
                name: "NBA",
              },
            };

            nbaLeague.fixtures.push(commonFixture);
          }
        });

        return nbaLeague.fixtures.length > 0 ? [nbaLeague] : [];
      } catch (error) {
        console.error(
          "Error fetching NBA games by date from The Odds API:",
          error
        );
        throw error;
      }
    },
  },

  // Implement baseball methods
  baseball: {
    getLiveGames: async (config: any): Promise<CommonLeague[]> => {
      // Similar implementation to basketball but for baseball_mlb
      try {
        const response = await axios.get(
          `${config.baseUrl}/sports/baseball_mlb/odds`,
          {
            params: {
              apiKey: config.apiKey,
              regions: "us",
              markets: "h2h",
              dateFormat: "iso",
              inPlay: "true",
            },
          }
        );

        const events = response.data || [];
        const mlbLeague: CommonLeague = {
          id: "baseball_mlb",
          name: "MLB",
          fixtures: [],
        };

        events.forEach((event: any) => {
          const commonFixture: CommonFixture = {
            id: event.id || "",
            homeTeam: {
              id: event.home_team,
              name: event.home_team || "Home Team",
            },
            awayTeam: {
              id: event.away_team,
              name: event.away_team || "Away Team",
            },
            score: {
              home: 0,
              away: 0,
            },
            startTime: event.commence_time || "",
            status: {
              status: "live",
            },
            league: {
              id: "baseball_mlb",
              name: "MLB",
            },
          };

          mlbLeague.fixtures.push(commonFixture);
        });

        return mlbLeague.fixtures.length > 0 ? [mlbLeague] : [];
      } catch (error) {
        console.error(
          "Error fetching live MLB games from The Odds API:",
          error
        );
        throw error;
      }
    },

    getGamesByDate: async (
      config: any,
      date: string
    ): Promise<CommonLeague[]> => {
      // Similar implementation to basketball getGamesByDate but for baseball_mlb
      try {
        const response = await axios.get(
          `${config.baseUrl}/sports/baseball_mlb/odds`,
          {
            params: {
              apiKey: config.apiKey,
              regions: "us",
              markets: "h2h",
              dateFormat: "iso",
            },
          }
        );

        const targetDate = new Date(date);
        const targetDateStr = targetDate.toISOString().split("T")[0];

        const events = response.data || [];
        const mlbLeague: CommonLeague = {
          id: "baseball_mlb",
          name: "MLB",
          fixtures: [],
        };

        events.forEach((event: any) => {
          const eventDate = new Date(event.commence_time);
          const eventDateStr = eventDate.toISOString().split("T")[0];

          if (eventDateStr === targetDateStr) {
            const commonFixture: CommonFixture = {
              id: event.id || "",
              homeTeam: {
                id: event.home_team,
                name: event.home_team || "Home Team",
              },
              awayTeam: {
                id: event.away_team,
                name: event.away_team || "Away Team",
              },
              score: {
                home: 0,
                away: 0,
              },
              startTime: event.commence_time || "",
              status: {
                status: "upcoming",
              },
              league: {
                id: "baseball_mlb",
                name: "MLB",
              },
            };

            mlbLeague.fixtures.push(commonFixture);
          }
        });

        return mlbLeague.fixtures.length > 0 ? [mlbLeague] : [];
      } catch (error) {
        console.error(
          "Error fetching MLB games by date from The Odds API:",
          error
        );
        throw error;
      }
    },
  },
};

export default theOddsApiProvider;
