import React, { useState, useEffect } from "react";
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
import { format, addDays } from "date-fns";

interface FilterPanelProps {
  onFilterChange: (filters: FilterOptions) => void;
  sportTypes: string[];
  leagues: string[];
  timeFrames: string[];
  initialFilters?: FilterOptions;
}

export interface FilterOptions {
  sportType: string;
  league: string;
  timeFrame: string;
  date: Date | undefined;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  onFilterChange = () => {},
  sportTypes = [],
  leagues = [],
  timeFrames = [],
  initialFilters,
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    sportType: "all",
    league: "all",
    timeFrame: "today",
    date: new Date(),
    ...(initialFilters || {}), // Use initialFilters if provided
  });

  // Effect to sync date with timeFrame
  useEffect(() => {
    if (filters.timeFrame === "today") {
      updateDateBasedOnTimeFrame(new Date());
    } else if (filters.timeFrame === "tomorrow") {
      updateDateBasedOnTimeFrame(addDays(new Date(), 1));
    }
    // No automatic date change for "this week" as it could refer to any day in the week
  }, [filters.timeFrame]);

  const updateDateBasedOnTimeFrame = (newDate: Date) => {
    setFilters((prev) => {
      const updated = { ...prev, date: newDate };
      onFilterChange(updated);
      return updated;
    });
  };

  const handleFilterChange = (
    key: keyof FilterOptions,
    value: any
  ) => {
    const newFilters = { ...filters, [key]: value };

    // Special handling for date changes when not coming from timeFrame changes
    if (key === "date" && value) {
      // When date is manually changed, determine which timeFrame it corresponds to
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = addDays(today, 1);
      tomorrow.setHours(0, 0, 0, 0);

      const selectedDate = new Date(value);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate.getTime() === today.getTime()) {
        newFilters.timeFrame = "today";
      } else if (selectedDate.getTime() === tomorrow.getTime()) {
        newFilters.timeFrame = "tomorrow";
      } else {
        newFilters.timeFrame = "this week"; // Default to "this week" for other dates
      }
    }

    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-background-cream/80 backdrop-blur-sm border-betvise-stone/30 dark:bg-betvise-blue-800/90 dark:border-betvise-blue-700 sticky top-0 z-10 w-full p-4 border-b">
      <div className="max-w-7xl mx-auto">
        <div className="md:flex-row md:items-center flex flex-col items-start justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Select
              value={filters.sportType}
              onValueChange={(value) =>
                handleFilterChange("sportType", value)
              }
            >
              <SelectTrigger className="w-[140px] bg-background border-betvise-stone/30 text-betvise-blue dark:bg-betvise-blue-700 dark:text-betvise-cream">
                <SelectValue placeholder="Sport Type" />
              </SelectTrigger>
              <SelectContent className="bg-background border-betvise-stone/30 text-betvise-blue dark:bg-betvise-blue-700 dark:text-betvise-cream">
                <SelectItem value="all">All Sports</SelectItem>
                {sportTypes.map((sport) => (
                  <SelectItem key={sport} value={sport.toLowerCase()}>
                    {sport}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.league}
              onValueChange={(value) =>
                handleFilterChange("league", value)
              }
            >
              <SelectTrigger className="w-[160px] bg-background border-betvise-stone/30 text-betvise-blue dark:bg-betvise-blue-700 dark:text-betvise-cream">
                <SelectValue placeholder="League" />
              </SelectTrigger>
              <SelectContent className="bg-background border-betvise-stone/30 text-betvise-blue dark:bg-betvise-blue-700 dark:text-betvise-cream">
                <SelectItem value="all">All Leagues</SelectItem>
                {leagues.map((league) => (
                  <SelectItem
                    key={league}
                    value={league.toLowerCase().replace(/ /g, "-")}
                  >
                    {league}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[160px] justify-start bg-background border-betvise-stone/30 text-betvise-blue hover:bg-betvise-rose/10 dark:bg-betvise-blue-700 dark:text-betvise-cream"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  {filters.date
                    ? format(filters.date, "PPP")
                    : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="bg-background border-betvise-stone/30 dark:bg-betvise-blue-700 w-auto p-0"
                align="start"
              >
                <CalendarComponent
                  mode="single"
                  selected={filters.date}
                  onSelect={(date) =>
                    handleFilterChange("date", date)
                  }
                  initialFocus
                  className="bg-background dark:bg-betvise-blue-700"
                />
              </PopoverContent>
            </Popover>
          </div>

          <Tabs
            defaultValue={filters.timeFrame}
            value={filters.timeFrame}
            onValueChange={(value) =>
              handleFilterChange("timeFrame", value)
            }
            className="md:w-auto w-full"
          >
            <TabsList className="bg-betvise-stone/20 dark:bg-betvise-blue-600">
              {timeFrames.map((timeFrame) => (
                <TabsTrigger
                  key={timeFrame}
                  value={timeFrame.toLowerCase()}
                  className="data-[state=active]:bg-background data-[state=active]:text-betvise-blue-800 dark:data-[state=active]:bg-betvise-blue-500 dark:data-[state=active]:text-betvise-cream"
                >
                  {timeFrame}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
