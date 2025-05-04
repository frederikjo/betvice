import React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface PieChartProps {
  title?: string;
  data: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
  height?: number | string;
  className?: string;
  colors?: string[];
  dataKey?: string;
  nameKey?: string;
  innerRadius?: number | string;
  outerRadius?: number | string;
}

const PieChart = ({
  title = "Pie Chart",
  data = [
    { name: "Football", value: 40, color: "#8884d8" },
    { name: "Basketball", value: 30, color: "#82ca9d" },
    { name: "Tennis", value: 15, color: "#ffc658" },
    { name: "Hockey", value: 10, color: "#ff8042" },
    { name: "Baseball", value: 5, color: "#0088fe" },
  ],
  height = 300,
  className = "",
  colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#0088fe",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
  ],
  dataKey = "value",
  nameKey = "name",
  innerRadius = "0%",
  outerRadius = "70%",
}: PieChartProps) => {
  return (
    <Card className={`w-full bg-background ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              fill="#8884d8"
              dataKey={dataKey}
              nameKey={nameKey}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || colors[index % colors.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${value}`, `Value`]}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
                borderRadius: "var(--radius)",
                color: "hsl(var(--card-foreground))",
              }}
            />
            <Legend />
          </RechartsPieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PieChart;
