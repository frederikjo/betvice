import { BTTSGame } from "./types";
import { config } from "@/lib/config";

const API_BASE = config.apiBase;
const API_TOKEN = config.sportmonksToken;

interface Prediction {
  type_id: number;
  predictions: {
    yes: number;
    no: number;
  };
}

type RoundResponse = {
  data: {
    id: number;
    name: string;
    fixtures: Fixture[];
  };
};

type Fixture = {
  id: number;
  name: string;
  starting_at: string;
  participants: Participant[];
  odds: Odd[];
};

type Participant = {
  id: number;
  name: string;
  meta: {
    location: "home" | "away";
  };
};

type Odd = {
  label: string; // "Yes" or "No"
  value: string; // e.g. "1.75"
  market: {
    name: string; // "Both Teams To Score"
  };
  bookmaker: {
    name: string; // "bet365"
  };
};

interface SportmonksResponse<T> {
  data: T;
}

const fetchFromSportmonks = async <T>(
  endpoint: string
): Promise<SportmonksResponse<T>> => {
  const url = `${API_BASE}${endpoint}?api_token=${API_TOKEN}`;
  const res = await fetch(url);

  if (!res.ok) {
    const text = await res.text();

    console.log(text);
    throw new Error(`Failed request: ${res.status} - ${text}`);
  }

  return res.json();
};

export const getTodayFixtures = async () => {
  const today = new Date().toISOString().split("T")[0];
  return fetchFromSportmonks<Fixture[]>(`/fixtures/date/${today}`);
};

export const getPredictionsByFixture = async (fixtureId: number) => {
  return fetchFromSportmonks<Prediction[]>(
    `/predictions/fixture/${fixtureId}`
  );
};

export async function getBttsPicksFromApi() {
  const res = await fetch("/api/btts-picks");

  if (!res.ok) throw new Error("Failed to fetch BTTS picks");

  const data = await res.json();
  return data as { games: BTTSGame[] };
}
