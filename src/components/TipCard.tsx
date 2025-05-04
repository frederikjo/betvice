import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CalendarIcon,
  InfoIcon,
  TrendingUpIcon,
  TrendingDownIcon,
} from "lucide-react";

interface TipCardProps {
  matchTitle?: string;
  teams?: {
    home: string;
    away: string;
  };
  league?: string;
  sportType?: string;
  date?: string;
  time?: string;
  odds?: {
    value: string;
    movement: "up" | "down" | "stable";
  };
  confidenceRating?: number;
  tipType?: string;
  isRecommended?: boolean;
  onClick?: () => void;
}

const TipCard = ({
  matchTitle = "Premier League Match",
  teams = { home: "Manchester United", away: "Liverpool" },
  league = "Premier League",
  sportType = "Football",
  date = "2023-05-15",
  time = "20:00",
  odds = { value: "2.10", movement: "up" },
  confidenceRating = 75,
  tipType = "Home Win",
  isRecommended = true,
  onClick = () => {},
}: TipCardProps) => {
  // Format date for display
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });

  // Determine confidence level text and color
  const getConfidenceLevel = () => {
    if (confidenceRating >= 80) return { text: "High", color: "bg-green-500" };
    if (confidenceRating >= 60)
      return { text: "Medium", color: "bg-yellow-500" };
    return { text: "Low", color: "bg-red-500" };
  };

  const confidenceLevel = getConfidenceLevel();

  return (
    <Card
      className={`w-full max-w-[380px] h-[220px] cursor-pointer hover:shadow-lg transition-shadow ${isRecommended ? "border-l-4 border-l-green-500" : ""}`}
      onClick={onClick}
    >
      <CardHeader className="p-4 pb-2 flex flex-row justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs font-normal">
              {sportType}
            </Badge>
            <Badge variant="outline" className="text-xs font-normal">
              {league}
            </Badge>
            {isRecommended && (
              <Badge className="bg-green-500 hover:bg-green-600 text-xs">
                Recommended
              </Badge>
            )}
          </div>
          <h3 className="font-semibold text-base">
            {teams.home} vs {teams.away}
          </h3>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <CalendarIcon size={14} />
          <span>
            {formattedDate} {time}
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-sm font-medium">Tip:</span>
            <span className="ml-2 font-semibold">{tipType}</span>
          </div>
          <div className="flex items-center">
            <span className="text-sm font-medium mr-2">Odds:</span>
            <span className="font-bold">{odds.value}</span>
            {odds.movement === "up" && (
              <TrendingUpIcon size={16} className="ml-1 text-green-500" />
            )}
            {odds.movement === "down" && (
              <TrendingDownIcon size={16} className="ml-1 text-red-500" />
            )}
          </div>
        </div>

        <div className="mb-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm">Confidence</span>
            <span className="text-sm font-medium">{confidenceRating}%</span>
          </div>
          <div className="relative">
            <Progress value={confidenceRating} className="h-2" />
            <div
              className={`absolute -right-1 -top-1 w-3 h-3 rounded-full ${confidenceLevel.color}`}
            ></div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center text-sm text-muted-foreground cursor-help">
                <InfoIcon size={14} className="mr-1" />
                <span>View analysis</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to see detailed analysis and statistics</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Badge
          variant={confidenceLevel.text === "High" ? "default" : "outline"}
          className="text-xs"
        >
          {confidenceLevel.text} Confidence
        </Badge>
      </CardFooter>
    </Card>
  );
};

export default TipCard;
