const API_BASE = "https://api.sportmonks.com/v3/football";
const API_TOKEN = import.meta.env.VITE_SPORTMONKS_TOKEN;

export interface Fixture {
  odds: any;
  id: number;
  name: string;
  starting_at: string;
  participants?: {
    data: {
      id: number;
      name: string;
      meta: {
        location: "home" | "away";
      };
    }[];
  };
}

interface FixturesResponse {
  data: Fixture[];
}

interface FixtureDetailResponse {
  data: Fixture;
}

const fetchSportmonks = async <T>(url: string): Promise<T> => {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch SportMonks data");
  }

  return res.json();
};

export const getFixturesByDate = async (date: string) => {
  return fetchSportmonks<FixturesResponse>(
    `${API_BASE}/fixtures/date/${date}?include=participants`
  );
};

export const getFixtureById = async (id: number) => {
  return fetchSportmonks<FixtureDetailResponse>(
    `${API_BASE}/fixtures/${id}?include=participants;odds;venue;scores;state;events`
  );
};
