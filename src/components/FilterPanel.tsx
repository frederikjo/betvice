import React, { useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

interface FilterPanelProps {
  onFilterChange: (filters: any) => void;
  sportTypes: string[];
  leagues: string[];
  timeFrames: string[];
}

export interface FilterOptions {
  sportType: string;
  league: string;
  timeFrame: string;
  date: Date | undefined;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  onFilterChange = () => {},
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    sportType: "all",
    league: "all",
    timeFrame: "today",
    date: new Date(),
  });

  const handleFilterChange = (
    key: keyof FilterOptions,
    value: any
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-background sticky top-0 z-10 w-full p-4 border-b">
      <div className="max-w-7xl mx-auto">
        <div className="md:flex-row md:items-center flex flex-col items-start justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Select
              value={filters.sportType}
              onValueChange={(value) =>
                handleFilterChange("sportType", value)
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sport Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sports</SelectItem>
                <SelectItem value="football">Football</SelectItem>
                <SelectItem value="basketball">Basketball</SelectItem>
                <SelectItem value="tennis">Tennis</SelectItem>
                <SelectItem value="hockey">Hockey</SelectItem>
                <SelectItem value="baseball">Baseball</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.league}
              onValueChange={(value) =>
                handleFilterChange("league", value)
              }
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="League" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Leagues</SelectItem>
                <SelectItem value="premier-league">
                  Premier League
                </SelectItem>
                <SelectItem value="la-liga">La Liga</SelectItem>
                <SelectItem value="bundesliga">Bundesliga</SelectItem>
                <SelectItem value="serie-a">Serie A</SelectItem>
                <SelectItem value="nba">NBA</SelectItem>
                <SelectItem value="nhl">NHL</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[160px] justify-start"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  {filters.date
                    ? format(filters.date, "PPP")
                    : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={filters.date}
                  onSelect={(date) =>
                    handleFilterChange("date", date)
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <Tabs
            defaultValue="today"
            value={filters.timeFrame}
            onValueChange={(value) =>
              handleFilterChange("timeFrame", value)
            }
            className="md:w-auto w-full"
          >
            <TabsList>
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="tomorrow">Tomorrow</TabsTrigger>
              <TabsTrigger value="weekend">Weekend</TabsTrigger>
              <TabsTrigger value="week">This Week</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
