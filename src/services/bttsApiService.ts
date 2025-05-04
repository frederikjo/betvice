// src/services/bttsApiService.ts
import type { BTTSGame } from "../lib/types";

// Mock data for development
const mockBTTSGames: BTTSGame[] = [
  {
    home: "Arsenal",
    away: "Manchester United",
    kickoff: "15:00",
    probability: 75.5,
  },
  {
    home: "Barcelona",
    away: "Real Madrid",
    kickoff: "20:00",
    probability: 82.3,
  },
  {
    home: "Bayern Munich",
    away: "Borussia Dortmund",
    kickoff: "17:30",
    probability: 88.7,
  },
  {
    home: "AC Milan",
    away: "Juventus",
    kickoff: "19:45",
    probability: 70.2,
  },
];

// Function to simulate API response
export async function getBTTSGames(): Promise<{ games: BTTSGame[] }> {
  // In a real app, this would be a fetch to your actual API
  return new Promise((resolve) => {
    // Simulate API latency
    setTimeout(() => {
      resolve({ games: mockBTTSGames });
    }, 500);
  });
}
