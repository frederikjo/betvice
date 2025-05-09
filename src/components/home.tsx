import React, { useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "./ui/button";
import FilterPanel from "./FilterPanel";
import TipsSection from "./home/TipsSection";
import PerformanceSection from "./home/PerformanceSection";
import Header from "./Header";
import BettingAssistantProvider from "./ai-bot/BettingAssistantProvider";
import { Card } from "./ui/card";
import FixtureList from "./Fixtures/FixtureList";

const Home = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <BettingAssistantProvider>
      <div
        className={`min-h-screen w-full bg-background ${
          isDarkMode ? "dark" : ""
        }`}
      >
        <Header />

        <main className="container px-4 py-6 mx-auto">
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">
              Today's Betting Tips
            </h2>
            <Card className="p-4">
              <FilterPanel
                onFilterChange={() => {}}
                sportTypes={[
                  "Football",
                  "Basketball",
                  "Tennis",
                  "Hockey",
                  "Baseball",
                ]}
                leagues={[
                  "Premier League",
                  "NBA",
                  "ATP",
                  "NHL",
                  "MLB",
                ]}
                timeFrames={["Today", "Tomorrow", "This Week"]}
              />
            </Card>
          </section>

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

          <FixtureList />
          {/* <TipsSection
            tips={[
              {
                id: "1",
                matchDetails: "Manchester United vs Liverpool",
                sportType: "Football",
                league: "Premier League",
                tipType: "Over 2.5 Goals",
                odds: 1.85,
                confidence: 85,
                time: "20:00",
                date: "2023-05-15",
              },
              {
                id: "2",
                matchDetails: "Lakers vs Warriors",
                sportType: "Basketball",
                league: "NBA",
                tipType: "Warriors to win",
                odds: 2.1,
                confidence: 75,
                time: "19:30",
                date: "2023-05-15",
              },
              {
                id: "3",
                matchDetails: "Djokovic vs Nadal",
                sportType: "Tennis",
                league: "ATP",
                tipType: "Nadal to win",
                odds: 2.5,
                confidence: 65,
                time: "14:00",
                date: "2023-05-16",
              },
              {
                id: "4",
                matchDetails: "Bruins vs Maple Leafs",
                sportType: "Hockey",
                league: "NHL",
                tipType: "Under 5.5 Goals",
                odds: 1.95,
                confidence: 70,
                time: "19:00",
                date: "2023-05-16",
              },
              {
                id: "5",
                matchDetails: "Yankees vs Red Sox",
                sportType: "Baseball",
                league: "MLB",
                tipType: "Yankees -1.5",
                odds: 2.2,
                confidence: 80,
                time: "18:00",
                date: "2023-05-17",
              },
              {
                id: "6",
                matchDetails: "Arsenal vs Chelsea",
                sportType: "Football",
                league: "Premier League",
                tipType: "Both Teams to Score",
                odds: 1.75,
                confidence: 90,
                time: "16:30",
                date: "2023-05-17",
              },
            ]}
          /> */}
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
