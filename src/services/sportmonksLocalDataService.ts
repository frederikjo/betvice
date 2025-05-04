// src/services/sportmonksLocalDataService.ts
import { BTTSGame } from "../lib/types";
import {
  processSportMonksData,
  processMockSportMonksData,
} from "../lib/sportMonksDirectParser";

// The raw SportMonks data (copy-pasted from the API response)
const rawSportMonksData = {
  id: 339269,
  sport_id: 1,
  league_id: 8,
  season_id: 23614,
  stage_id: 77471288,
  name: "34",
  finished: true,
  is_current: false,
  starting_at: "2025-04-22",
  ending_at: "2025-05-01",
  games_in_current_week: true,
  fixtures: [
    {
      id: 19135003,
      sport_id: 1,
      league_id: 8,
      season_id: 23614,
      stage_id: 77471288,
      group_id: null,
      aggregate_id: null,
      round_id: 339269,
      state_id: 5,
      venue_id: 230,
      name: "Liverpool vs Tottenham Hotspur",
      starting_at: "2025-04-27 15:30:00",
      result_info: "Liverpool won after full-time.",
      leg: "1/1",
      details: null,
      length: 90,
      placeholder: false,
      has_odds: true,
      has_premium_odds: true,
      starting_at_timestamp: 1745767800,
      odds: [
        {
          id: 167876622322,
          fixture_id: 19135003,
          market_id: 14,
          bookmaker_id: 2,
          label: "No",
          value: "2.05",
          name: null,
          sort_order: 1,
          market_description: "Both Teams to Score",
          probability: "48.78%",
          dp3: "2.050",
          fractional: "41/20",
          american: "104",
          winning: false,
          stopped: false,
          total: null,
          handicap: null,
          participants: null,
          created_at: "2025-04-12T13:15:57.000000Z",
          original_label: null,
          latest_bookmaker_update: "2025-04-27 15:34:33",
          market: {
            id: 14,
            legacy_id: 976105,
            name: "Both Teams To Score",
            developer_name: "BOTH_TEAMS_TO_SCORE",
            has_winning_calculations: true,
          },
          bookmaker: {
            id: 2,
            legacy_id: 2,
            name: "bet365",
          },
        },
        {
          id: 167876622321,
          fixture_id: 19135003,
          market_id: 14,
          bookmaker_id: 2,
          label: "Yes",
          value: "1.70",
          name: null,
          sort_order: 0,
          market_description: "Both Teams to Score",
          probability: "58.82%",
          dp3: "1.700",
          fractional: "17/10",
          american: "-143",
          winning: true,
          stopped: false,
          total: null,
          handicap: null,
          participants: null,
          created_at: "2025-04-12T13:15:57.000000Z",
          original_label: null,
          latest_bookmaker_update: "2025-04-27 15:34:33",
          market: {
            id: 14,
            legacy_id: 976105,
            name: "Both Teams To Score",
            developer_name: "BOTH_TEAMS_TO_SCORE",
            has_winning_calculations: true,
          },
          bookmaker: {
            id: 2,
            legacy_id: 2,
            name: "bet365",
          },
        },
      ],
      participants: [
        {
          id: 8,
          sport_id: 1,
          country_id: 462,
          venue_id: 230,
          gender: "male",
          name: "Liverpool",
          short_code: "LIV",
          image_path:
            "https://cdn.sportmonks.com/images/soccer/teams/8/8.png",
          founded: 1892,
          type: "domestic",
          placeholder: false,
          last_played_at: "2025-04-27 15:30:00",
          meta: {
            location: "home",
            winner: true,
            position: 1,
          },
        },
        {
          id: 6,
          sport_id: 1,
          country_id: 462,
          venue_id: 281313,
          gender: "male",
          name: "Tottenham Hotspur",
          short_code: "TOT",
          image_path:
            "https://cdn.sportmonks.com/images/soccer/teams/6/6.png",
          founded: 1882,
          type: "domestic",
          placeholder: false,
          last_played_at: "2025-05-01 19:00:00",
          meta: {
            location: "away",
            winner: false,
            position: 16,
          },
        },
      ],
    },
    {
      id: 19135004,
      sport_id: 1,
      league_id: 8,
      season_id: 23614,
      stage_id: 77471288,
      group_id: null,
      aggregate_id: null,
      round_id: 339269,
      state_id: 5,
      venue_id: 151,
      name: "Manchester City vs Aston Villa",
      starting_at: "2025-04-22 19:00:00",
      result_info: "Manchester City won after full-time.",
      leg: "1/1",
      details: null,
      length: 90,
      placeholder: false,
      has_odds: true,
      has_premium_odds: true,
      starting_at_timestamp: 1745348400,
      odds: [
        {
          id: 167876513609,
          fixture_id: 19135004,
          market_id: 14,
          bookmaker_id: 2,
          label: "No",
          value: "2.37",
          name: null,
          sort_order: 1,
          market_description: "Both Teams to Score",
          probability: "42.11%",
          dp3: "2.375",
          fractional: "19/8",
          american: "137",
          winning: false,
          stopped: false,
          total: null,
          handicap: null,
          participants: null,
          created_at: "2025-04-12T13:14:48.000000Z",
          original_label: null,
          latest_bookmaker_update: "2025-04-22 18:53:33",
          market: {
            id: 14,
            legacy_id: 976105,
            name: "Both Teams To Score",
            developer_name: "BOTH_TEAMS_TO_SCORE",
            has_winning_calculations: true,
          },
          bookmaker: {
            id: 2,
            legacy_id: 2,
            name: "bet365",
          },
        },
        {
          id: 167876513608,
          fixture_id: 19135004,
          market_id: 14,
          bookmaker_id: 2,
          label: "Yes",
          value: "1.53",
          name: null,
          sort_order: 0,
          market_description: "Both Teams to Score",
          probability: "65.23%",
          dp3: "1.533",
          fractional: "23/15",
          american: "-188",
          winning: true,
          stopped: false,
          total: null,
          handicap: null,
          participants: null,
          created_at: "2025-04-12T13:14:48.000000Z",
          original_label: null,
          latest_bookmaker_update: "2025-04-22 18:53:33",
          market: {
            id: 14,
            legacy_id: 976105,
            name: "Both Teams To Score",
            developer_name: "BOTH_TEAMS_TO_SCORE",
            has_winning_calculations: true,
          },
          bookmaker: {
            id: 2,
            legacy_id: 2,
            name: "bet365",
          },
        },
      ],
      participants: [
        {
          id: 15,
          sport_id: 1,
          country_id: 462,
          venue_id: 5,
          gender: "male",
          name: "Aston Villa",
          short_code: "AVL",
          image_path:
            "https://cdn.sportmonks.com/images/soccer/teams/15/15.png",
          founded: 1874,
          type: "domestic",
          placeholder: false,
          last_played_at: "2025-05-03 11:30:00",
          meta: {
            location: "away",
            winner: false,
            position: 7,
          },
        },
        {
          id: 9,
          sport_id: 1,
          country_id: 462,
          venue_id: 151,
          gender: "male",
          name: "Manchester City",
          short_code: "MCI",
          image_path:
            "https://cdn.sportmonks.com/images/soccer/teams/9/9.png",
          founded: 1880,
          type: "domestic",
          placeholder: false,
          last_played_at: "2025-05-02 19:00:00",
          meta: {
            location: "home",
            winner: true,
            position: 5,
          },
        },
      ],
    },
    {
      id: 19135001,
      sport_id: 1,
      league_id: 8,
      season_id: 23614,
      stage_id: 77471288,
      group_id: null,
      aggregate_id: null,
      round_id: 339269,
      state_id: 5,
      venue_id: 282066,
      name: "Brighton & Hove Albion vs West Ham United",
      starting_at: "2025-04-26 14:00:00",
      result_info: "Brighton & Hove Albion won after full-time.",
      leg: "1/1",
      details: null,
      length: 90,
      placeholder: false,
      has_odds: true,
      has_premium_odds: true,
      starting_at_timestamp: 1745676000,
      odds: [
        {
          id: 167876620220,
          fixture_id: 19135001,
          market_id: 14,
          bookmaker_id: 2,
          label: "No",
          value: "2.10",
          name: null,
          sort_order: 1,
          market_description: "Both Teams to Score",
          probability: "47.62%",
          dp3: "2.100",
          fractional: "21/10",
          american: "110",
          winning: false,
          stopped: false,
          total: null,
          handicap: null,
          participants: null,
          created_at: "2025-04-12T13:15:55.000000Z",
          original_label: null,
          latest_bookmaker_update: "2025-04-26 14:11:46",
          market: {
            id: 14,
            legacy_id: 976105,
            name: "Both Teams To Score",
            developer_name: "BOTH_TEAMS_TO_SCORE",
            has_winning_calculations: true,
          },
          bookmaker: {
            id: 2,
            legacy_id: 2,
            name: "bet365",
          },
        },
        {
          id: 167876620219,
          fixture_id: 19135001,
          market_id: 14,
          bookmaker_id: 2,
          label: "Yes",
          value: "1.66",
          name: null,
          sort_order: 0,
          market_description: "Both Teams to Score",
          probability: "60.02%",
          dp3: "1.666",
          fractional: "5/3",
          american: "-151",
          winning: true,
          stopped: false,
          total: null,
          handicap: null,
          participants: null,
          created_at: "2025-04-12T13:15:55.000000Z",
          original_label: null,
          latest_bookmaker_update: "2025-04-26 14:11:46",
          market: {
            id: 14,
            legacy_id: 976105,
            name: "Both Teams To Score",
            developer_name: "BOTH_TEAMS_TO_SCORE",
            has_winning_calculations: true,
          },
          bookmaker: {
            id: 2,
            legacy_id: 2,
            name: "bet365",
          },
        },
      ],
      participants: [
        {
          id: 1,
          sport_id: 1,
          country_id: 462,
          venue_id: 214,
          gender: "male",
          name: "West Ham United",
          short_code: "WHU",
          image_path:
            "https://cdn.sportmonks.com/images/soccer/teams/1/1.png",
          founded: 1895,
          type: "domestic",
          placeholder: false,
          last_played_at: "2025-04-26 14:00:00",
          meta: {
            location: "away",
            winner: false,
            position: 17,
          },
        },
        {
          id: 78,
          sport_id: 1,
          country_id: 462,
          venue_id: 480,
          gender: "male",
          name: "Brighton & Hove Albion",
          short_code: "BHA",
          image_path:
            "https://cdn.sportmonks.com/images/soccer/teams/14/78.png",
          founded: 1901,
          type: "domestic",
          placeholder: false,
          last_played_at: "2025-04-26 14:00:00",
          meta: {
            location: "home",
            winner: true,
            position: 9,
          },
        },
      ],
    },
  ],
};

/**
 * Get BTTS picks from local SportMonks data
 * This uses the actual SportMonks data format that you shared
 */
export async function getLocalSportMonksData(): Promise<{
  games: BTTSGame[];
}> {
  console.log("Getting BTTS picks from local SportMonks data...");

  // Process the raw data
  const processedData = processSportMonksData(rawSportMonksData);

  console.log(
    `Processed ${processedData.games.length} BTTS games from local data`
  );

  // Add a slight delay to simulate API latency
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(processedData);
    }, 300);
  });
}

/**
 * Get BTTS picks from mock data (simplified version)
 * Use this as a fallback if the main data processing doesn't work
 */
export async function getMockSportMonksData(): Promise<{
  games: BTTSGame[];
}> {
  console.log("Getting BTTS picks from mock data...");

  // Process using mock data
  const processedData = processMockSportMonksData();

  console.log(
    `Processed ${processedData.games.length} BTTS games from mock data`
  );

  // Add a slight delay to simulate API latency
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(processedData);
    }, 300);
  });
}
