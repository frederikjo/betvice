import React from "react";
import PerformanceTracker from "../PerformanceTracker";
import type { PerformanceData } from "../PerformanceTracker";

interface PerformanceSectionProps {
  successRate?: number;
  winLossRatio?: string;
  profitMargin?: string;
  timePeriods?: string[];
}

const PerformanceSection: React.FC<PerformanceSectionProps> = ({
  successRate = 68,
  winLossRatio = "34-16",
  profitMargin = "+12.5%",
  timePeriods = [
    "Last Week",
    "Last Month",
    "Last 3 Months",
    "All Time",
  ],
}) => {
  // Parse the win-loss ratio to get counts
  const [wins, losses] = winLossRatio
    .split("-")
    .map((num) => parseInt(num, 10));

  // Parse profit margin percentage to a number
  const profitLossValue = parseFloat(profitMargin.replace("%", ""));

  // Create the data object expected by PerformanceTracker
  const performanceData = {
    weekly: {
      successRate: successRate,
      winCount: wins,
      lossCount: losses,
      totalTips: wins + losses,
      profitLoss: profitLossValue,
      streak: 3, // Default value since we don't have this in props
      streakType: "win" as const,
    },
    monthly: {
      successRate: successRate + 2,
      winCount: wins * 4,
      lossCount: losses * 4,
      totalTips: (wins + losses) * 4,
      profitLoss: profitLossValue * 4,
      streak: 3,
      streakType: "win" as const,
    },
    allTime: {
      successRate: successRate + 1,
      winCount: wins * 12,
      lossCount: losses * 12,
      totalTips: (wins + losses) * 12,
      profitLoss: profitLossValue * 12,
      streak: 3,
      streakType: "win" as const,
    },
  };

  return (
    <section className="mb-8">
      <PerformanceTracker data={performanceData} />
    </section>
  );
};

export default PerformanceSection;
