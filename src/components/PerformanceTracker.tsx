import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, BarChart2 } from "lucide-react";

interface PerformanceData {
  successRate: number;
  winCount: number;
  lossCount: number;
  totalTips: number;
  profitLoss: number;
  streak: number;
  streakType: "win" | "loss";
}

interface PerformanceTrackerProps {
  data?: {
    weekly: PerformanceData;
    monthly: PerformanceData;
    allTime: PerformanceData;
  };
}

const PerformanceTracker: React.FC<PerformanceTrackerProps> = ({
  data = {
    weekly: {
      successRate: 68,
      winCount: 17,
      lossCount: 8,
      totalTips: 25,
      profitLoss: 124.5,
      streak: 3,
      streakType: "win",
    },
    monthly: {
      successRate: 72,
      winCount: 65,
      lossCount: 25,
      totalTips: 90,
      profitLoss: 342.75,
      streak: 3,
      streakType: "win",
    },
    allTime: {
      successRate: 70,
      winCount: 210,
      lossCount: 90,
      totalTips: 300,
      profitLoss: 1250.25,
      streak: 3,
      streakType: "win",
    },
  },
}) => {
  return (
    <Card className="w-full bg-background">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">
            Performance Tracker
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <BarChart2 className="h-3 w-3" />
              <span>Stats</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekly" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="weekly">This Week</TabsTrigger>
            <TabsTrigger value="monthly">This Month</TabsTrigger>
            <TabsTrigger value="allTime">All Time</TabsTrigger>
          </TabsList>

          {Object.entries(data).map(([period, stats]) => (
            <TabsContent key={period} value={period} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Success Rate</span>
                    <span className="text-2xl font-bold">
                      {stats.successRate}%
                    </span>
                  </div>
                  <Progress value={stats.successRate} className="h-2" />
                </div>

                <div className="flex flex-col justify-center items-center bg-muted/30 rounded-md p-3">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Wins</p>
                      <p className="text-xl font-bold text-green-500">
                        {stats.winCount}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Losses</p>
                      <p className="text-xl font-bold text-red-500">
                        {stats.lossCount}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-xl font-bold">{stats.totalTips}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-center items-center bg-muted/30 rounded-md p-3">
                  <div className="flex items-center gap-2">
                    <div>
                      {stats.profitLoss >= 0 ? (
                        <TrendingUp className="h-6 w-6 text-green-500" />
                      ) : (
                        <TrendingDown className="h-6 w-6 text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Profit/Loss
                      </p>
                      <p
                        className={`text-xl font-bold ${stats.profitLoss >= 0 ? "text-green-500" : "text-red-500"}`}
                      >
                        {stats.profitLoss >= 0 ? "+" : ""}
                        {stats.profitLoss.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Badge
                      variant={
                        stats.streakType === "win" ? "default" : "destructive"
                      }
                      className="text-xs"
                    >
                      {stats.streak}{" "}
                      {stats.streakType === "win" ? "Win" : "Loss"} Streak
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex justify-center items-center h-16 bg-muted/20 rounded-md">
                <p className="text-sm text-muted-foreground">
                  Historical performance chart will be displayed here
                </p>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PerformanceTracker;
