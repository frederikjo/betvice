import React from "react";
import { Button } from "../ui/button";
import TipsFeed from "../TipsFeed";

interface TipsSectionProps {
  tips?: Array<{
    id: string;
    matchDetails: string;
    sportType: string;
    league: string;
    tipType: string;
    odds: number;
    confidence: number;
    time: string;
    date: string;
  }>;
}

const TipsSection: React.FC<TipsSectionProps> = ({ tips = [] }) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Recommended Tips</h2>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>
      <TipsFeed tips={tips} />
    </section>
  );
};

export default TipsSection;
