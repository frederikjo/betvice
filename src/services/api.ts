import { Fixture } from "@/types/api";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

// Define response types matching the actual API structure
interface ApiResponse<T> {
  data: T;
  pagination?: {
    count: number;
    per_page: number;
    current_page: number;
    next_page?: number | null;
    has_more: boolean;
  };
  subscription?: any[];
  rate_limit?: {
    resets_in_seconds: number;
    remaining: number;
    requested_entity: string;
  };
  timezone?: string;
}

// SportMonks league structure
interface League {
  id: number;
  sport_id: number;
  country_id: number;
  name: string;
  active: boolean;
  short_code?: string;
  image_path?: string;
  type: string;
  sub_type?: string;
  last_played_at?: string;
  category?: number;
  has_jerseys: boolean;
  today: Fixture[];
  [key: string]: any;
}

// Get the API token from environment variables
const API_TOKEN = import.meta.env.VITE_SPORTMONKS_TOKEN;

// Log whether token is available (masked for security)
console.log(
  "API Token in service:",
  API_TOKEN
    ? `${API_TOKEN.substring(0, 4)}...${API_TOKEN.substring(
        API_TOKEN.length - 4
      )}`
    : "NOT FOUND"
);

// API service for all external API requests
const apiService = {
  /**
   * SportMonks API
   * Documentation: https://docs.sportmonks.com/football/welcome/introduction
   */
  sportmonks: {
    /**
     * Generic request function for SportMonks API
     * @param endpoint - API endpoint without the base path (e.g., "/football/leagues")
     * @param params - Optional query parameters
     * @param options - Additional axios options
     */
    request: async <T>(
      endpoint: string,
      params: Record<string, any> = {},
      options: AxiosRequestConfig = {}
    ): Promise<ApiResponse<T>> => {
      try {
        // All SportMonks API requests will be proxied through /api/sportmonks
        const url = `/api/sportmonks${endpoint}`;

        // Add the token to the params explicitly
        const paramsWithToken = {
          ...params,
          api_token: API_TOKEN,
        };

        // Also set up headers with the token
        const config: AxiosRequestConfig = {
          params: paramsWithToken,
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            ...options.headers,
          },
          ...options,
        };

        console.log("Making request to:", url);
        console.log("With params:", paramsWithToken);

        const response: AxiosResponse<ApiResponse<T>> =
          await axios.get(url, config);
        return response.data;
      } catch (error) {
        console.error(`SportMonks API error (${endpoint}):`, error);
        throw error;
      }
    },

    // Football API endpoints
    football: {
      /**
       * Get fixtures for a specific date
       * @param date - Date in YYYY-MM-DD format
       */
      getFixturesByDate: (date: string) =>
        apiService.sportmonks.request<League[]>(
          `/football/leagues/date/${date}`,
          {
            include:
              "today.scores;today.participants;today.stage;today.group;today.round",
            per_page: 100, // Increase items per page
          }
        ),

      /**
       * Get all inplay livescores (currently live matches)
       * @returns All currently live matches
       */
      getInplayLivescores: () =>
        apiService.sportmonks.request<Fixture[]>(
          `/football/livescores/inplay`,
          {
            include: "league;scores;participants;stage;group;round",
          }
        ),
    },
  },
};

export default apiService;
