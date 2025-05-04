// src/services/sportmonksLocalDataService.ts
import { BTTSGame } from "../lib/types";
import { processSportMonksData } from "../lib/sportMonksDirectParser";

// This function is now a direct pass-through to the API service
export async function getLocalSportMonksData(): Promise<{
  games: BTTSGame[];
}> {
  // Return empty games array - this will force using the real API
  return { games: [] };
}

// This function is now a direct pass-through to the API service
export async function getMockSportMonksData(): Promise<{
  games: BTTSGame[];
}> {
  // Return empty games array - this will force using the real API
  return { games: [] };
}
