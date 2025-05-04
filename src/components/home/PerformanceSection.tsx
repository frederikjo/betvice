import React from "react";
import PerformanceTracker from "../PerformanceTracker";

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
  timePeriods = ["Last Week", "Last Month", "Last 3 Months", "All Time"],
}) => {
  return (
    <section className="mb-8">
      <h2 className="mb-4 text-xl font-semibold">Performance Tracker</h2>
      <PerformanceTracker
        successRate={successRate}
        winLossRatio={winLossRatio}
        profitMargin={profitMargin}
        timePeriods={timePeriods}
      />
    </section>
  );
};

export default PerformanceSection;
