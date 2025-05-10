/**
 * API types for SportMonks API responses and data structures
 */

// API Response wrapper
export interface ApiResponse<T> {
  data: T;
  pagination?: {
    count: number;
    per_page: number;
    current_page: number;
    next_page?: number;
    has_more_pages: boolean;
    total_pages: number;
  };
  subscription?: {
    started_at: string;
    trial: boolean;
    active: boolean;
  };
  rate_limit?: {
    resets_in_seconds: number;
    remaining: number;
    requested_entity: string;
  };
  query?: Record<string, any>;
}

// Sports data types
export interface Country {
  id: number;
  name: string;
  image_path?: string;
  // Add other fields as needed
}

export interface Participant {
  id: number;
  name: string;
  image_path?: string;
  position?: number;
  captain?: boolean;
  // Add other fields as needed
}

export interface Score {
  home_score: number;
  away_score: number;
  // Add other fields as needed
}

export interface Fixture {
  id: number;
  starting_at: string;
  status: string;
  participants: Participant[];
  scores?: Score;
  venue_id?: number;
  weather_report?: any;
  periods?: any;
  // Add other fields as needed
}

export interface League {
  id: number;
  name: string;
  active: boolean;
  country: Country;
  sport_id?: number;
  type?: string;
  logo_path?: string;
  image_path?: string;
  fixtures?: Fixture[];
  // Add other fields as needed
}

// Extend these interfaces as you discover more fields from the API responses
