import React from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBettingAssistant } from "@/context/BettingAssistantContext";

const BettingAssistantButton = () => {
  const { toggleChatbot, isOpen } = useBettingAssistant();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleChatbot}
      aria-label="Toggle Betting Assistant"
    >
      <MessageSquare
        className={`w-5 h-5 ${isOpen ? "text-primary" : ""}`}
      />
    </Button>
  );
};

export default BettingAssistantButton;
