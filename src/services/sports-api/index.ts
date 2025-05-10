// src/services/sports-api/index.ts
import axios from "axios";
import sportmonksProvider from "./providers/sportmonks";
import theOddsApiProvider from "./providers/the-odds-api";

// Define the provider types
export type SportsApiProvider = "sportmonks" | "theOddsApi";

// Common response interfaces
export interface Team {
  id: string | number;
  name: string;
  logo?: string;
}

export interface Score {
  home: number;
  away: number;
}

export interface FixtureStatus {
  status: "live" | "upcoming" | "finished";
  elapsed?: number;
}

export interface CommonFixture {
  id: string | number;
  homeTeam: Team;
  awayTeam: Team;
  score: Score;
  startTime: string;
  status: FixtureStatus;
  league: {
    id: string | number;
    name: string;
    logo?: string;
    country?: string;
  };
}

export interface CommonLeague {
  id: string | number;
  name: string;
  country?: string;
  logo?: string;
  fixtures: CommonFixture[];
}

export interface CommonPlayerStat {
  playerId: string | number;
  playerName: string;
  teamId: string | number;
  teamName: string;
  stats: Record<string, any>;
}

// Provider configuration
interface ProviderConfig {
  apiKey: string;
  baseUrl?: string;
  [key: string]: any;
}

// Provider configurations
const providerConfigs: Record<SportsApiProvider, ProviderConfig> = {
  sportmonks: {
    apiKey: import.meta.env.VITE_SPORTMONKS_TOKEN || "",
    baseUrl: "/api/sportmonks", // Using your proxy
  },
  theOddsApi: {
    apiKey: import.meta.env.VITE_THE_ODDS_API_KEY || "",
    baseUrl: "https://api.the-odds-api.com/v4",
  },
};

// Set initial provider (can be configured from env or user settings)
let activeProvider: SportsApiProvider =
  (localStorage.getItem("activeProvider") as SportsApiProvider) ||
  "sportmonks";

// The sports API service
const sportsApi = {
  // Method to change the active provider
  setProvider: (provider: SportsApiProvider): void => {
    if (!Object.keys(providerConfigs).includes(provider)) {
      throw new Error(`Provider ${provider} is not supported`);
    }
    activeProvider = provider;
    localStorage.setItem("activeProvider", provider);
    console.log(`Sports API provider changed to: ${provider}`);
  },

  // Get current provider name
  getActiveProvider: (): SportsApiProvider => activeProvider,

  // Get available providers
  getAvailableProviders: (): SportsApiProvider[] =>
    Object.keys(providerConfigs) as SportsApiProvider[],

  // Football/Soccer methods
  football: {
    // Get live matches
    getLiveMatches: async (): Promise<CommonLeague[]> => {
      switch (activeProvider) {
        case "sportmonks":
          return sportmonksProvider.football.getLiveMatches(
            providerConfigs.sportmonks
          );
        case "theOddsApi":
          return theOddsApiProvider.football.getLiveMatches(
            providerConfigs.theOddsApi
          );
        default:
          throw new Error(
            `Provider ${activeProvider} not implemented`
          );
      }
    },

    // Get matches by date
    getMatchesByDate: async (
      date: string
    ): Promise<CommonLeague[]> => {
      switch (activeProvider) {
        case "sportmonks":
          return sportmonksProvider.football.getMatchesByDate(
            providerConfigs.sportmonks,
            date
          );
        case "theOddsApi":
          return theOddsApiProvider.football.getMatchesByDate(
            providerConfigs.theOddsApi,
            date
          );
        default:
          throw new Error(
            `Provider ${activeProvider} not implemented`
          );
      }
    },

    // Get player statistics
    getPlayerStats: async (
      playerId: string
    ): Promise<CommonPlayerStat> => {
      switch (activeProvider) {
        case "sportmonks":
          return sportmonksProvider.football.getPlayerStats(
            providerConfigs.sportmonks,
            playerId
          );
        case "theOddsApi":
          return theOddsApiProvider.football.getPlayerStats(
            providerConfigs.theOddsApi,
            playerId
          );
        default:
          throw new Error(
            `Provider ${activeProvider} not implemented`
          );
      }
    },
  },

  // Basketball (NBA) methods
  basketball: {
    // Get live games
    getLiveGames: async (): Promise<CommonLeague[]> => {
      switch (activeProvider) {
        case "sportmonks":
          return sportmonksProvider.basketball.getLiveGames(
            providerConfigs.sportmonks
          );
        case "theOddsApi":
          return theOddsApiProvider.basketball.getLiveGames(
            providerConfigs.theOddsApi
          );
        default:
          throw new Error(
            `Provider ${activeProvider} not implemented`
          );
      }
    },

    // Get games by date
    getGamesByDate: async (date: string): Promise<CommonLeague[]> => {
      switch (activeProvider) {
        case "sportmonks":
          return sportmonksProvider.basketball.getGamesByDate(
            providerConfigs.sportmonks,
            date
          );
        case "theOddsApi":
          return theOddsApiProvider.basketball.getGamesByDate(
            providerConfigs.theOddsApi,
            date
          );
        default:
          throw new Error(
            `Provider ${activeProvider} not implemented`
          );
      }
    },
  },

  // Baseball (MLB) methods
  baseball: {
    // Get live games
    getLiveGames: async (): Promise<CommonLeague[]> => {
      switch (activeProvider) {
        case "sportmonks":
          return sportmonksProvider.baseball.getLiveGames(
            providerConfigs.sportmonks
          );
        case "theOddsApi":
          return theOddsApiProvider.baseball.getLiveGames(
            providerConfigs.theOddsApi
          );
        default:
          throw new Error(
            `Provider ${activeProvider} not implemented`
          );
      }
    },

    // Get games by date
    getGamesByDate: async (date: string): Promise<CommonLeague[]> => {
      switch (activeProvider) {
        case "sportmonks":
          return sportmonksProvider.baseball.getGamesByDate(
            providerConfigs.sportmonks,
            date
          );
        case "theOddsApi":
          return theOddsApiProvider.baseball.getGamesByDate(
            providerConfigs.theOddsApi,
            date
          );
        default:
          throw new Error(
            `Provider ${activeProvider} not implemented`
          );
      }
    },
  },
};

export default sportsApi;
