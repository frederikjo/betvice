import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { PerformanceData } from "../PerformanceTracker";

interface PerformanceChartProps {
  data: PerformanceData;
  period: string;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({
  data,
  period,
}) => {
  // Transform the data for the chart
  const chartData = [
    {
      name: "Wins",
      value: data.winCount,
      fill: "#10b981", // green-500
    },
    {
      name: "Losses",
      value: data.lossCount,
      fill: "#ef4444", // red-500
    },
    {
      name: "Success Rate",
      value: data.successRate,
      fill: "#3b82f6", // blue-500
    },
    {
      name: "Profit",
      value: data.profitLoss > 0 ? data.profitLoss : 0,
      fill: "#10b981", // green-500
    },
    {
      name: "Loss",
      value: data.profitLoss < 0 ? Math.abs(data.profitLoss) : 0,
      fill: "#ef4444", // red-500
    },
  ];

  // Filter out zero values
  const filteredChartData = chartData.filter(
    (item) => item.value > 0
  );

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={filteredChartData}
          margin={{
            top: 5,
            right: 5,
            left: 5,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="name" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip
            formatter={(value, name) => {
              if (name === "Success Rate") return [`${value}%`, name];
              if (name === "Profit" || name === "Loss")
                return [`$${(value as number).toFixed(2)}`, name];
              return [value, name];
            }}
          />
          <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]}>
            {filteredChartData.map((entry, index) => (
              <Bar
                key={`bar-${index}`}
                dataKey="value"
                fill={entry.fill}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;
