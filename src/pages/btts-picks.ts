import type { NextApiRequest, NextApiResponse } from "next";
import {
  getTodayFixtures,
  getPredictionsByFixture,
} from "@/lib/sportmonks";

type BTTSGame = {
  home: string;
  away: string;
  kickoff: string;
  probability: number;
};

type Data = {
  games: BTTSGame[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | { error: string }>
) {
  try {
    const fixturesData = await getTodayFixtures();
    const fixtures = fixturesData.data;

    const highBTTSGames: BTTSGame[] = [];

    for (const fixture of fixtures) {
      // Ensure participants are loaded properly
      const homeTeam =
        fixture.participants?.find((p) => p.meta?.location === "home")
          ?.name ?? "Home";
      const awayTeam =
        fixture.participants?.find((p) => p.meta?.location === "away")
          ?.name ?? "Away";

      // Fetch BTTS predictions
      const predictionData = await getPredictionsByFixture(
        fixture.id
      );
      const prediction = predictionData.data.find(
        (p) => p.type_id === 231 // BTTS type id
      );

      if (prediction && prediction.predictions?.yes > 60) {
        highBTTSGames.push({
          home: homeTeam,
          away: awayTeam,
          kickoff: fixture.starting_at ?? "Unknown",
          probability: prediction.predictions.yes,
        });
      }

      // To avoid rate limits, wait a little
      await new Promise((resolve) => setTimeout(resolve, 250));
    }

    res.status(200).json({ games: highBTTSGames });
  } catch (error) {
    console.error("[BTTS API Error]", error);
    res.status(500).json({ error: "Failed to fetch BTTS picks" });
  }
}
