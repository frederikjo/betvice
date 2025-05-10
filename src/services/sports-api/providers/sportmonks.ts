// src/services/sports-api/providers/sportmonks.ts
import axios from "axios";
import {
  CommonLeague,
  CommonFixture,
  CommonPlayerStat,
} from "../index";

const sportmonksProvider = {
  football: {
    getLiveMatches: async (config: any): Promise<CommonLeague[]> => {
      try {
        const response = await axios.get(
          `${config.baseUrl}/football/livescores/inplay`,
          {
            params: {
              api_token: config.apiKey,
              include: "league;scores;participants;stage;group;round",
            },
          }
        );

        // Transform SportMonks response to common format
        const fixtures = response.data.data || [];
        const leaguesMap: { [key: string]: CommonLeague } = {};

        fixtures.forEach((fixture: any) => {
          const league = fixture.league || {};
          const leagueId = league.id?.toString() || "";

          if (!leaguesMap[leagueId]) {
            leaguesMap[leagueId] = {
              id: leagueId,
              name: league.name || "Unknown League",
              country: league.country_id?.toString() || "",
              logo: league.image_path || "",
              fixtures: [],
            };
          }

          // Find home and away teams
          const homeTeam =
            fixture.participants?.find(
              (p: any) => p?.meta?.location === "home"
            ) || {};
          const awayTeam =
            fixture.participants?.find(
              (p: any) => p?.meta?.location === "away"
            ) || {};

          // Get current scores
          const homeScore =
            fixture.scores?.find(
              (s: any) =>
                s.description === "CURRENT" &&
                s.score?.participant === "home"
            )?.score?.goals || 0;
          const awayScore =
            fixture.scores?.find(
              (s: any) =>
                s.description === "CURRENT" &&
                s.score?.participant === "away"
            )?.score?.goals || 0;

          // Create common fixture object
          const commonFixture: CommonFixture = {
            id: fixture.id?.toString() || "",
            homeTeam: {
              id: homeTeam.id?.toString() || "",
              name: homeTeam.name || "Home Team",
              logo: homeTeam.image_path || "",
            },
            awayTeam: {
              id: awayTeam.id?.toString() || "",
              name: awayTeam.name || "Away Team",
              logo: awayTeam.image_path || "",
            },
            score: {
              home: homeScore,
              away: awayScore,
            },
            startTime: fixture.starting_at || "",
            status: {
              status:
                fixture.state_id === 2
                  ? "live"
                  : fixture.state_id === 3
                  ? "finished"
                  : "upcoming",
            },
            league: {
              id: leagueId,
              name: league.name || "Unknown League",
              logo: league.image_path || "",
              country: league.country_id?.toString() || "",
            },
          };

          leaguesMap[leagueId].fixtures.push(commonFixture);
        });

        return Object.values(leaguesMap);
      } catch (error) {
        console.error(
          "Error fetching live matches from SportMonks:",
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
        const response = await axios.get(
          `${config.baseUrl}/football/leagues/date/${date}`,
          {
            params: {
              api_token: config.apiKey,
              include:
                "today.scores;today.participants;today.stage;today.group;today.round",
              per_page: 100,
            },
          }
        );

        // Transform SportMonks response to common format
        const leagues = response.data.data || [];
        const commonLeagues: CommonLeague[] = [];

        leagues.forEach((league: any) => {
          const fixtures = league.today || [];
          const commonFixtures: CommonFixture[] = [];

          fixtures.forEach((fixture: any) => {
            // Find home and away teams
            const homeTeam =
              fixture.participants?.find(
                (p: any) => p?.meta?.location === "home"
              ) || {};
            const awayTeam =
              fixture.participants?.find(
                (p: any) => p?.meta?.location === "away"
              ) || {};

            // Get current scores
            const homeScore =
              fixture.scores?.find(
                (s: any) =>
                  s.description === "CURRENT" &&
                  s.score?.participant === "home"
              )?.score?.goals || 0;
            const awayScore =
              fixture.scores?.find(
                (s: any) =>
                  s.description === "CURRENT" &&
                  s.score?.participant === "away"
              )?.score?.goals || 0;

            // Create common fixture object
            const commonFixture: CommonFixture = {
              id: fixture.id?.toString() || "",
              homeTeam: {
                id: homeTeam.id?.toString() || "",
                name: homeTeam.name || "Home Team",
                logo: homeTeam.image_path || "",
              },
              awayTeam: {
                id: awayTeam.id?.toString() || "",
                name: awayTeam.name || "Away Team",
                logo: awayTeam.image_path || "",
              },
              score: {
                home: homeScore,
                away: awayScore,
              },
              startTime: fixture.starting_at || "",
              status: {
                status:
                  fixture.state_id === 2
                    ? "live"
                    : fixture.state_id === 3
                    ? "finished"
                    : "upcoming",
              },
              league: {
                id: league.id?.toString() || "",
                name: league.name || "Unknown League",
                logo: league.image_path || "",
                country: league.country_id?.toString() || "",
              },
            };

            commonFixtures.push(commonFixture);
          });

          if (commonFixtures.length > 0) {
            commonLeagues.push({
              id: league.id?.toString() || "",
              name: league.name || "Unknown League",
              country: league.country_id?.toString() || "",
              logo: league.image_path || "",
              fixtures: commonFixtures,
            });
          }
        });

        return commonLeagues;
      } catch (error) {
        console.error(
          "Error fetching matches by date from SportMonks:",
          error
        );
        throw error;
      }
    },

    getPlayerStats: async (
      config: any,
      playerId: string
    ): Promise<CommonPlayerStat> => {
      try {
        const response = await axios.get(
          `${config.baseUrl}/football/players/${playerId}`,
          {
            params: {
              api_token: config.apiKey,
              include: "stats;team",
            },
          }
        );

        const player = response.data.data || {};
        const team = player.team || {};

        return {
          playerId: player.id?.toString() || "",
          playerName: player.name || "Unknown Player",
          teamId: team.id?.toString() || "",
          teamName: team.name || "Unknown Team",
          stats: player.stats || {},
        };
      } catch (error) {
        console.error(
          "Error fetching player stats from SportMonks:",
          error
        );
        throw error;
      }
    },
  },

  // Implement basketball methods as needed (if SportMonks supports it)
  basketball: {
    getLiveGames: async (config: any): Promise<CommonLeague[]> => {
      // Implement if SportMonks supports NBA
      return [];
    },
    getGamesByDate: async (
      config: any,
      date: string
    ): Promise<CommonLeague[]> => {
      // Implement if SportMonks supports NBA
      return [];
    },
  },

  // Implement baseball methods as needed (if SportMonks supports it)
  baseball: {
    getLiveGames: async (config: any): Promise<CommonLeague[]> => {
      // Implement if SportMonks supports MLB
      return [];
    },
    getGamesByDate: async (
      config: any,
      date: string
    ): Promise<CommonLeague[]> => {
      // Implement if SportMonks supports MLB
      return [];
    },
  },
};

export default sportmonksProvider;
