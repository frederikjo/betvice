// Mock data for betting statistics and insights

// Performance data for different time periods
export const getPerformanceData = () => {
  return {
    weekly: {
      successRate: 68,
      winCount: 17,
      lossCount: 8,
      totalTips: 25,
      profitLoss: 124.5,
      streak: 3,
      streakType: "win" as const,
    },
    monthly: {
      successRate: 72,
      winCount: 65,
      lossCount: 25,
      totalTips: 90,
      profitLoss: 342.75,
      streak: 3,
      streakType: "win" as const,
    },
    allTime: {
      successRate: 70,
      winCount: 210,
      lossCount: 90,
      totalTips: 300,
      profitLoss: 1250.25,
      streak: 3,
      streakType: "win" as const,
    },
  };
};

// Performance trend data for line chart
export const getPerformanceTrendData = () => {
  return [
    { date: "Jan 1", winRate: 60, profitMargin: 5.2 },
    { date: "Jan 8", winRate: 65, profitMargin: 7.1 },
    { date: "Jan 15", winRate: 62, profitMargin: 6.8 },
    { date: "Jan 22", winRate: 70, profitMargin: 9.3 },
    { date: "Jan 29", winRate: 68, profitMargin: 8.5 },
    { date: "Feb 5", winRate: 72, profitMargin: 10.2 },
    { date: "Feb 12", winRate: 75, profitMargin: 12.5 },
    { date: "Feb 19", winRate: 69, profitMargin: 9.8 },
    { date: "Feb 26", winRate: 73, profitMargin: 11.3 },
    { date: "Mar 5", winRate: 70, profitMargin: 10.5 },
  ];
};

// Sport distribution data for pie chart
export const getSportDistributionData = () => {
  return [
    { name: "Football", value: 45, color: "#8884d8" },
    { name: "Basketball", value: 25, color: "#82ca9d" },
    { name: "Tennis", value: 15, color: "#ffc658" },
    { name: "Hockey", value: 10, color: "#ff8042" },
    { name: "Baseball", value: 5, color: "#0088fe" },
  ];
};

// Odds analysis data for bar chart
export const getOddsAnalysisData = () => {
  return [
    { range: "1.01-1.50", successRate: 85 },
    { range: "1.51-2.00", successRate: 72 },
    { range: "2.01-3.00", successRate: 58 },
    { range: "3.01-5.00", successRate: 42 },
    { range: "5.01+", successRate: 25 },
  ];
};

// Leaderboard data for top tipsters
export interface Tipster {
  id: string;
  name: string;
  avatar: string;
  winRate: number;
  profitMargin: number;
  tipCount: number;
  streak: number;
  streakType: "win" | "loss";
}

export const getLeaderboardData = (): Tipster[] => {
  return [
    {
      id: "1",
      name: "BetMaster",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=BetMaster",
      winRate: 78,
      profitMargin: 15.3,
      tipCount: 245,
      streak: 8,
      streakType: "win",
    },
    {
      id: "2",
      name: "SportGuru",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SportGuru",
      winRate: 75,
      profitMargin: 14.2,
      tipCount: 312,
      streak: 5,
      streakType: "win",
    },
    {
      id: "3",
      name: "OddsWizard",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=OddsWizard",
      winRate: 72,
      profitMargin: 12.8,
      tipCount: 189,
      streak: 3,
      streakType: "win",
    },
    {
      id: "4",
      name: "PredictionPro",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=PredictionPro",
      winRate: 70,
      profitMargin: 11.5,
      tipCount: 276,
      streak: 2,
      streakType: "loss",
    },
    {
      id: "5",
      name: "BettingExpert",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=BettingExpert",
      winRate: 68,
      profitMargin: 10.9,
      tipCount: 203,
      streak: 4,
      streakType: "win",
    },
  ];
};
