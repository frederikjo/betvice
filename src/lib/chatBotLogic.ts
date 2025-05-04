// src/lib/chatBotLogic.ts
import { getBTTSGames } from "../services/bttsApiService";
import type { BTTSGame } from "./types";

type BotResponseHandler = () => Promise<string>;

export const botResponseHandlers: Record<string, BotResponseHandler> =
  {
    greetings: async () => {
      return "Hello! How can I assist you with betting tips or stats today?";
    },

    btts: async () => {
      try {
        // Use the service function instead of direct API call
        const data = await getBTTSGames();

        if (!data.games.length) {
          return "No BTTS picks found for today.";
        }

        const formattedGames = data.games
          .map(
            (game) =>
              `${game.home} vs ${game.away} - Kickoff: ${
                game.kickoff
              } - Probability BTTS: ${game.probability.toFixed(1)}%`
          )
          .join("\n");

        console.log(formattedGames, data);

        return `Here are today's BTTS picks:\n\n${formattedGames}`;
      } catch (error) {
        console.error("BTTS Error:", error);
        return "Sorry, there was an error fetching BTTS picks. Please try again later.";
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
