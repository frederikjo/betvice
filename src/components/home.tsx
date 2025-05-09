import React, { useState } from "react";
import { FilterOptions } from "@/components/FilterPanel";
import FilterPanel from "./FilterPanel";
import PerformanceSection from "./home/PerformanceSection";
import Header from "./Header";
import BettingAssistantProvider from "./ai-bot/BettingAssistantProvider";
import FixtureList from "./Fixtures/FixtureList";
import { BarChart, Filter, Calendar } from "lucide-react";
import StyledCollapsible from "./CollapsibleSection"; // Import your new component

const Home = () => {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    sportType: "all",
    league: "all",
    timeFrame: "today",
    date: new Date(),
  });

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilterOptions(newFilters);
    console.log("Filters updated:", newFilters);
  };

  return (
    <BettingAssistantProvider>
      <div className="bg-background w-full min-h-screen">
        <Header />

        <main className="container px-4 py-6 mx-auto">
          <StyledCollapsible
            title="Today's Betting Tips"
            icon={Filter}
            defaultOpen={true}
          >
            <FilterPanel
              onFilterChange={handleFilterChange}
              sportTypes={[
                "Football",
                "Basketball",
                "Tennis",
                "Hockey",
                "Baseball",
              ]}
              leagues={["Premier League", "NBA", "ATP", "NHL", "MLB"]}
              timeFrames={["Today", "Tomorrow", "This Week"]}
              initialFilters={filterOptions}
            />
          </StyledCollapsible>

          <StyledCollapsible
            title="Performance Tracker"
            icon={BarChart}
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

          <StyledCollapsible title="Fixtures" icon={Calendar}>
            <FixtureList />
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

export default Home;
