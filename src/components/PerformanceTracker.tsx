import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, BarChart2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export interface PerformanceData {
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
  // Function to transform the data for the chart
  const getChartData = (stats: PerformanceData) => {
    return [
      {
        name: "Wins",
        value: stats.winCount,
        fill: "#10b981", // green-500
      },
      {
        name: "Losses",
        value: stats.lossCount,
        fill: "#ef4444", // red-500
      },
      {
        name: "Success %",
        value: stats.successRate,
        fill: "#3b82f6", // blue-500
      },
      {
        name: "Profit",
        value: Math.round(stats.profitLoss * 100) / 100, // Round to 2 decimal places
        fill: "#10b981", // green-500
      },
    ];
  };

  return (
    <Card className="bg-background w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">
            Performance Tracker
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="flex items-center gap-1"
            >
              <BarChart2 className="w-3 h-3" />
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
            <TabsContent
              key={period}
              value={period}
              className="space-y-4"
            >
              <div className="md:grid-cols-3 grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Success Rate
                    </span>
                    <span className="text-2xl font-bold">
                      {stats.successRate}%
                    </span>
                  </div>
                  <Progress
                    value={stats.successRate}
                    className="h-2"
                  />
                </div>

                <div className="bg-muted/30 flex flex-col items-center justify-center p-3 rounded-md">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-muted-foreground text-sm">
                        Wins
                      </p>
                      <p className="text-xl font-bold text-green-500">
                        {stats.winCount}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground text-sm">
                        Losses
                      </p>
                      <p className="text-xl font-bold text-red-500">
                        {stats.lossCount}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground text-sm">
                        Total
                      </p>
                      <p className="text-xl font-bold">
                        {stats.totalTips}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/30 flex flex-col items-center justify-center p-3 rounded-md">
                  <div className="flex items-center gap-2">
                    <div>
                      {stats.profitLoss >= 0 ? (
                        <TrendingUp className="w-6 h-6 text-green-500" />
                      ) : (
                        <TrendingDown className="w-6 h-6 text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">
                        Profit/Loss
                      </p>
                      <p
                        className={`text-xl font-bold ${
                          stats.profitLoss >= 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {stats.profitLoss >= 0 ? "+" : ""}
                        {stats.profitLoss.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Badge
                      variant={
                        stats.streakType === "win"
                          ? "default"
                          : "destructive"
                      }
                      className="text-xs"
                    >
                      {stats.streak}{" "}
                      {stats.streakType === "win" ? "Win" : "Loss"}{" "}
                      Streak
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Replace the placeholder with the actual chart */}
              <div className="w-full h-48 overflow-hidden rounded-md">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getChartData(stats)}
                    margin={{
                      top: 10,
                      right: 10,
                      left: 10,
                      bottom: 20,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      opacity={0.2}
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      tickLine={{ stroke: "#888" }}
                      axisLine={{ stroke: "#888" }}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickLine={{ stroke: "#888" }}
                      axisLine={{ stroke: "#888" }}
                    />
                    <Tooltip
                      formatter={(value, name) => {
                        if (name === "Success %")
                          return [`${value}%`, name];
                        if (name === "Profit")
                          return [`$${value}`, name];
                        return [value, name];
                      }}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {getChartData(stats).map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.fill}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PerformanceTracker;
