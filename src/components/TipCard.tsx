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
    if (confidenceRating >= 80)
      return { text: "High", color: "bg-betvise-sage" };
    if (confidenceRating >= 60)
      return { text: "Medium", color: "bg-betvise-terracotta" };
    return { text: "Low", color: "bg-betvise-berry" };
  };

  const confidenceLevel = getConfidenceLevel();

  return (
    <Card
      className={`w-full max-w-[380px] h-[220px] cursor-pointer hover:shadow-lg transition-shadow card-hazy backdrop-blur-sm dark:bg-betvise-blue-800/90 dark:border-betvise-blue-700/50 ${
        isRecommended ? "border-l-4 border-l-betvise-sage" : ""
      }`}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-start justify-between p-4 pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge
              variant="outline"
              className="border-betvise-stone/30 text-betvise-blue dark:text-betvise-cream text-xs font-normal"
            >
              {sportType}
            </Badge>
            <Badge
              variant="outline"
              className="border-betvise-stone/30 text-betvise-blue dark:text-betvise-cream text-xs font-normal"
            >
              {league}
            </Badge>
            {isRecommended && (
              <Badge className="bg-betvise-sage hover:bg-betvise-sage-600 text-betvise-blue-900 text-xs">
                Recommended
              </Badge>
            )}
          </div>
          <h3 className="text-betvise-blue-800 dark:text-betvise-cream text-base font-semibold">
            {teams.home} vs {teams.away}
          </h3>
        </div>
        <div className="text-betvise-blue flex items-center gap-1 text-sm">
          <CalendarIcon size={14} />
          <span>
            {formattedDate} {time}
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-sm font-medium">Tip:</span>
            <span className="ml-2 font-semibold">{tipType}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2 text-sm font-medium">Odds:</span>
            <span className="font-bold">{odds.value}</span>
            {odds.movement === "up" && (
              <TrendingUpIcon
                size={16}
                className="ml-1 text-green-500"
              />
            )}
            {odds.movement === "down" && (
              <TrendingDownIcon
                size={16}
                className="ml-1 text-red-500"
              />
            )}
          </div>
        </div>

        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm">Confidence</span>
            <span className="text-sm font-medium">
              {confidenceRating}%
            </span>
          </div>
          <div className="relative">
            <Progress value={confidenceRating} className="h-2" />
            <div
              className={`absolute -right-1 -top-1 w-3 h-3 rounded-full ${confidenceLevel.color}`}
            ></div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-muted-foreground cursor-help flex items-center text-sm">
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
          variant={
            confidenceLevel.text === "High" ? "default" : "outline"
          }
          className="text-xs"
        >
          {confidenceLevel.text} Confidence
        </Badge>
      </CardFooter>
    </Card>
  );
};

export default TipCard;
