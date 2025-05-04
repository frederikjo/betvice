import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Tipster } from "@/services/mockDataService";

export interface LeaderboardProps {
  title?: string;
  tipsters: Tipster[];
  className?: string;
}

const Leaderboard = ({
  title = "Top Tipsters",
  tipsters = [],
  className = "",
}: LeaderboardProps) => {
  return (
    <Card className={`w-full bg-background ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tipsters.map((tipster) => (
            <div
              key={tipster.id}
              className="flex items-center justify-between rounded-lg border p-3 shadow-sm"
            >
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={tipster.avatar} alt={tipster.name} />
                  <AvatarFallback>
                    {tipster.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{tipster.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {tipster.tipCount} tips
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {tipster.winRate}% Win Rate
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {tipster.profitMargin > 0 ? "+" : ""}
                    {tipster.profitMargin}% Profit
                  </p>
                </div>
                <Badge
                  variant={
                    tipster.streakType === "win" ? "success" : "destructive"
                  }
                  className={`${tipster.streakType === "win" ? "bg-green-500" : "bg-red-500"} text-white`}
                >
                  {tipster.streakType === "win" ? "W" : "L"}
                  {tipster.streak}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
