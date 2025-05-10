// src/pages/BettingTipsPage.tsx
import React, { useState } from "react";
import Header from "../components/Header";
import BettingAssistantProvider from "../components/ai-bot/BettingAssistantProvider";
import FilterPanel, {
  FilterOptions,
} from "../components/FilterPanel";
import { Filter } from "lucide-react";
import StyledCollapsible from "../components/CollapsibleSection";

const BettingTipsPage = () => {
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

export default BettingTipsPage;
