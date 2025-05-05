// /pages/api/get-fixture.ts
import type { NextApiRequest, NextApiResponse } from "next";

const API_TOKEN = process.env.SPORTMONKS_API_TOKEN;
const API_BASE = "https://api.sportmonks.com/v3/football";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id) {
    res.status(400).json({ error: "Fixture ID is required" });
    return;
  }

  const url = `${API_BASE}/fixtures/${id}?api_token=${API_TOKEN}&include=participants;league;venue;state;scores;events.type;odds.market;odds.bookmaker;predictions`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch fixture: ${response.statusText}`
      );
    }

    const data = await response.json();

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch fixture data" });
  }
}
