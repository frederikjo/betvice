// src/pages/PerformanceTrackerPage.tsx
import React from "react";
import Header from "../components/Header";
import BettingAssistantProvider from "../components/ai-bot/BettingAssistantProvider";
import PerformanceSection from "../components/home/PerformanceSection";
import { BarChart } from "lucide-react";
import StyledCollapsible from "../components/CollapsibleSection";

const PerformanceTrackerPage = () => {
  return (
    <BettingAssistantProvider>
      <div className="bg-background w-full min-h-screen">
        <Header />

        <main className="container px-4 py-6 mx-auto">
          <StyledCollapsible
            title="Performance Tracker"
            icon={BarChart}
            defaultOpen={true}
          >
            <PerformanceSection
              successRate={68}
              winLossRatio="34-16"
              profitMargin="+12.5%"
              timePeriods={[
                "Last Week",
                "Last Month",
                "Last 3 Months",
                "All Time",
              ]}
            />
          </StyledCollapsible>
        </main>

        <footer className="bg-background text-muted-foreground p-4 text-sm text-center border-t">
          <div className="container mx-auto">
            <p>
              © {new Date().getFullYear()} Betting Tips App. All
              rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </BettingAssistantProvider>
  );
};

export default PerformanceTrackerPage;
