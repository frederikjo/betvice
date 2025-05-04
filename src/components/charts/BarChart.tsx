import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface BarChartProps {
  title?: string;
  data: Array<{ [key: string]: string | number }>;
  bars: Array<{
    dataKey: string;
    fill: string;
    name?: string;
  }>;
  xAxisDataKey: string;
  height?: number | string;
  className?: string;
}

const BarChart = ({
  title = "Bar Chart",
  data = [
    { name: "Football", value: 400 },
    { name: "Basketball", value: 300 },
    { name: "Tennis", value: 200 },
    { name: "Hockey", value: 150 },
    { name: "Baseball", value: 250 },
  ],
  bars = [{ dataKey: "value", fill: "#8884d8", name: "Value" }],
  xAxisDataKey = "name",
  height = 300,
  className = "",
}: BarChartProps) => {
  return (
    <Card className={`w-full bg-background ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsBarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis
              dataKey={xAxisDataKey}
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
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
                borderRadius: "var(--radius)",
                color: "hsl(var(--card-foreground))",
              }}
            />
            <Legend />
            {bars.map((bar, index) => (
              <Bar
                key={index}
                dataKey={bar.dataKey}
                fill={bar.fill}
                name={bar.name || bar.dataKey}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default BarChart;
