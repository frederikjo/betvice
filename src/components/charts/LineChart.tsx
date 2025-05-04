import React from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface LineChartProps {
  title?: string;
  data: Array<{ [key: string]: string | number }>;
  lines: Array<{
    dataKey: string;
    stroke: string;
    name?: string;
  }>;
  xAxisDataKey: string;
  height?: number | string;
  className?: string;
}

const LineChart = ({
  title = "Line Chart",
  data = [
    { name: "Jan", value1: 100, value2: 120 },
    { name: "Feb", value1: 200, value2: 160 },
    { name: "Mar", value1: 150, value2: 190 },
    { name: "Apr", value1: 300, value2: 270 },
    { name: "May", value1: 250, value2: 220 },
    { name: "Jun", value1: 400, value2: 350 },
  ],
  lines = [
    { dataKey: "value1", stroke: "#8884d8", name: "Series 1" },
    { dataKey: "value2", stroke: "#82ca9d", name: "Series 2" },
  ],
  xAxisDataKey = "name",
  height = 300,
  className = "",
}: LineChartProps) => {
  return (
    <Card className={`w-full bg-background ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsLineChart
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
            {lines.map((line, index) => (
              <Line
                key={index}
                type="monotone"
                dataKey={line.dataKey}
                stroke={line.stroke}
                name={line.name || line.dataKey}
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default LineChart;
