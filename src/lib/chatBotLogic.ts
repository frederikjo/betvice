// src/lib/chatBotLogic.ts
import {
  getLocalSportMonksData,
  getMockSportMonksData,
} from "../services/sportmonksLocalDataService";

type BotResponseHandler = () => Promise<string>;

export const botResponseHandlers: Record<string, BotResponseHandler> =
  {
    greetings: async () => {
      return "Hello! How can I assist you with betting tips or stats today?";
    },

    btts: async () => {
      try {
        console.log(
          "Fetching BTTS picks from local SportMonks data..."
        );

        // Use the local SportMonks data (no API call needed)
        const data = await getLocalSportMonksData();

        console.log(`Received ${data.games.length} BTTS picks`);

        if (!data.games.length) {
          // Try with mock data as fallback
          console.log("No BTTS games found, trying mock data...");
          const mockData = await getMockSportMonksData();

          if (!mockData.games.length) {
            return "No BTTS picks found for today.";
          }

          console.log(
            `Found ${mockData.games.length} mock BTTS games`
          );

          const formattedGames = mockData.games
            .map(
              (game) =>
                `${game.home} vs ${game.away} - Kickoff: ${
                  game.kickoff
                } - Probability BTTS: ${game.probability.toFixed(1)}%`
            )
            .join("\n");

          return `Here are today's BTTS picks (from mock data):\n\n${formattedGames}`;
        }

        const formattedGames = data.games
          .map(
            (game) =>
              `${game.home} vs ${game.away} - Kickoff: ${
                game.kickoff
              } - Probability BTTS: ${game.probability.toFixed(1)}%`
          )
          .join("\n");

        return `Here are today's BTTS picks from Premier League:\n\n${formattedGames}`;
      } catch (error) {
        console.error("Error in BTTS handler:", error);
        return "Sorry, I couldn't fetch the BTTS picks at the moment. Please try again later.";
      }
    },

    fallback: async () => {
      return "I'm not sure how to help with that. Try asking about BTTS games, today's tips, or performance stats.";
    },
  };

export const detectIntent = (
  message: string
): keyof typeof botResponseHandlers => {
  const lower = message.toLowerCase();

  if (
    lower.includes("hi") ||
    lower.includes("hello") ||
    lower.includes("help")
  ) {
    return "greetings";
  }

  if (
    lower.includes("btts") ||
    lower.includes("both teams to score")
  ) {
    return "btts";
  }

  return "fallback";
};
