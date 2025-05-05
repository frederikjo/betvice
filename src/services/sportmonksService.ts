// src/services/sportmonksService.ts
import { fetchWithErrorHandling } from "@/lib/apiUtils";

// Types
interface Team {
  id: number;
  name: string;
  shortCode?: string;
  logo?: string;
  isHome: boolean;
}

interface League {
  id: number;
  name: string;
  country?: string;
  logo?: string;
}

interface Fixture {
  id: number;
  homeTeam: Team;
  awayTeam: Team;
  league?: League;
  status?: string;
  startTime: string;
  scores?: {
    homeScore: number;
    awayScore: number;
  };
}

interface FixtureDetails extends Fixture {
  venue?: {
    id: number;
    name: string;
    city?: string;
    capacity?: number;
  };
  events?: any[];
  odds?: any[];
  predictions?: any;
  referee?: string;
  weather?: {
    temperature?: number;
    description?: string;
    humidity?: number;
  };
}

// Get API Token from environment variable
const API_TOKEN = import.meta.env.VITE_SPORTMONKS_TOKEN;
const API_BASE_URL =
  import.meta.env.VITE_API_BASE ||
  "https://api.sportmonks.com/v3/football";

/**
 * Fetch football fixtures for a specific date
 * @param date Date in format YYYY-MM-DD
 * @returns Array of fixtures
 */
export async function fetchFootballFixtures(
  date: string
): Promise<Fixture[]> {
  try {
    // Check if API token is available
    if (!API_TOKEN) {
      console.error(
        "SportMonks API token is missing. Add VITE_SPORTMONKS_TOKEN to your .env file"
      );
      return [];
    }

    // Build URL with parameters
    const url = `${API_BASE_URL}/fixtures/date/${date}?api_token=${API_TOKEN}&include=league,participants,scores`;

    // Make API call
    const response = await fetchWithErrorHandling(url);

    // Check if data exists
    if (!response?.data || !Array.isArray(response?.data)) {
      return [];
    }

    // Transform API response to our format
    return response.data.map((fixture: any) =>
      transformFixture(fixture)
    );
  } catch (error) {
    console.error("Error fetching football fixtures:", error);
    throw error;
  }
}

/**
 * Fetch detailed information for a specific fixture
 * @param fixtureId ID of the fixture to fetch
 * @returns Detailed fixture information
 */
export async function fetchFixtureDetails(
  fixtureId: number
): Promise<FixtureDetails> {
  try {
    // Check if API token is available
    if (!API_TOKEN) {
      console.error(
        "SportMonks API token is missing. Add VITE_SPORTMONKS_TOKEN to your .env file"
      );
      throw new Error("API token is missing");
    }

    // Includes for detailed fixture information
    const includes = [
      "league",
      "participants",
      "venue",
      "scores",
      "events",
      "state",
      "odds",
      "odds.market",
      "odds.bookmaker",
      "predictions",
    ].join(",");

    // Build URL with parameters
    const url = `${API_BASE_URL}/fixtures/${fixtureId}?api_token=${API_TOKEN}&include=${includes}`;

    // Make API call
    const response = await fetchWithErrorHandling(url);

    // Check if data exists
    if (!response?.data) {
      throw new Error("No data returned from API");
    }

    // Transform API response to our format
    return transformFixtureDetails(response.data);
  } catch (error) {
    console.error(
      `Error fetching fixture details for ID ${fixtureId}:`,
      error
    );
    throw error;
  }
}

/**
 * Transform fixture data from API format to our application format
 * @param data Raw fixture data from API
 * @returns Transformed fixture data
 */
function transformFixture(data: any): Fixture {
  // Extract home and away teams
  const homeTeam: Team = {
    id: 0,
    name: "Unknown Team",
    isHome: true,
  };

  const awayTeam: Team = {
    id: 0,
    name: "Unknown Team",
    isHome: false,
  };

  // Process participants if available
  if (data.participants && Array.isArray(data.participants)) {
    data.participants.forEach((participant: any) => {
      if (participant.meta?.location === "home") {
        homeTeam.id = participant.id;
        homeTeam.name = participant.name;
        homeTeam.shortCode = participant.short_code;
        homeTeam.logo = participant.image_path;
      } else if (participant.meta?.location === "away") {
        awayTeam.id = participant.id;
        awayTeam.name = participant.name;
        awayTeam.shortCode = participant.short_code;
        awayTeam.logo = participant.image_path;
      }
    });
  }

  // Extract league data if available
  let league: League | undefined;
  if (data.league) {
    league = {
      id: data.league.id,
      name: data.league.name,
      country: data.league.country?.name,
      logo: data.league.image_path,
    };
  }

  // Extract scores if available
  let scores;
  if (data.scores && Array.isArray(data.scores)) {
    // Find latest score
    const latestScore = data.scores.reduce(
      (latest: any, score: any) => {
        if (
          !latest ||
          new Date(score.updated_at) > new Date(latest.updated_at)
        ) {
          return score;
        }
        return latest;
      },
      null
    );

    if (latestScore) {
      scores = {
        homeScore:
          latestScore.score.participant_id === homeTeam.id
            ? latestScore.score.goals
            : latestScore.score.participant_id === awayTeam.id
            ? 0
            : null,
        awayScore:
          latestScore.score.participant_id === awayTeam.id
            ? latestScore.score.goals
            : latestScore.score.participant_id === homeTeam.id
            ? 0
            : null,
      };
    }
  }

  // Create fixture object
  return {
    id: data.id,
    homeTeam,
    awayTeam,
    league,
    status: data.state?.state || data.status,
    startTime: data.starting_at || data.starting_at_timestamp,
    scores,
  };
}

/**
 * Transform detailed fixture data from API format to our application format
 * @param data Raw fixture details from API
 * @returns Transformed fixture details
 */
function transformFixtureDetails(data: any): FixtureDetails {
  // Get basic fixture data
  const fixture = transformFixture(data);

  // Extract venue data if available
  let venue;
  if (data.venue) {
    venue = {
      id: data.venue.id,
      name: data.venue.name,
      city: data.venue.city?.name,
      capacity: data.venue.capacity,
    };
  }

  // Extract referee if available
  const referee = data.officials?.find(
    (official: any) => official.type === "referee"
  )?.name;

  // Extract weather data if available
  let weather;
  if (data.weather) {
    weather = {
      temperature: data.weather.temperature?.value,
      description: data.weather.weather_conditions?.description,
      humidity: data.weather.humidity?.value,
    };
  }

  // Extract odds if available
  let odds;
  if (data.odds && Array.isArray(data.odds.data)) {
    odds = data.odds.data.map((odd: any) => {
      return {
        id: odd.id,
        name: odd.name,
        value: odd.value,
        handcap: odd.handicap,
        total: odd.total,
        market: odd.market?.name,
        bookmaker: odd.bookmaker?.name,
      };
    });
  }

  // Extract events like goals, cards, etc.
  let events;
  if (data.events && Array.isArray(data.events.data)) {
    events = data.events.data.map((event: any) => {
      return {
        id: event.id,
        type: event.type,
        minute: event.minute,
        participant: event.participant?.name,
        result: event.result,
      };
    });
  }

  // Extract predictions if available
  let predictions;
  if (data.predictions && Array.isArray(data.predictions.data)) {
    predictions = data.predictions.data.reduce(
      (acc: any, prediction: any) => {
        acc[prediction.type.toLowerCase()] = {
          value: prediction.prediction,
          probability: prediction.probability,
        };
        return acc;
      },
      {}
    );
  }

  // Return combined data
  return {
    ...fixture,
    venue,
    referee,
    weather,
    odds,
    events,
    predictions,
  };
}

/**
 * Helper function to map SportMonks status to our application status
 * @param status Status from SportMonks API
 * @returns Standardized status string
 */
export function mapFixtureStatus(status: string): string {
  const statusMap: Record<string, string> = {
    NS: "SCHEDULED", // Not Started
    LIVE: "LIVE",
    HT: "LIVE", // Half Time
    FT: "FINISHED", // Full Time
    AET: "FINISHED", // After Extra Time
    PEN: "FINISHED", // Penalties
    SUSP: "SUSPENDED", // Suspended
    INT: "INTERRUPTED", // Interrupted
    PST: "POSTPONED", // Postponed
    CANC: "CANCELLED", // Cancelled
    ABD: "ABANDONED", // Abandoned
    AWD: "AWARDED", // Awarded (technical result)
    WO: "WALKOVER", // Walkover (forfeit)
  };

  return statusMap[status] || status;
}
