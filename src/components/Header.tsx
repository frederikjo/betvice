import React, { useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "./ui/button";
import BettingAssistantButton from "./ai-bot/BettingAssistantButton";
import BettingAssistant from "./ai-bot/BettingAssistant";

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // In a real implementation, this would update the theme in the document
    // document.documentElement.classList.toggle('dark');
  };

  return (
    <>
      <header className="brounded-xl border bg-card text-card-foreground fixed bottom-4 right-4 shadow-lg z-50 w-80 h-96 md:w-96 md:h-[450px]g-background sticky top-0 z-10 p-4 border-b shadow-sm">
        <div className="container flex items-center justify-between mx-auto">
          <h1 className="text-primary text-2xl font-bold">
            Betting Tips
          </h1>
          <div className="flex items-center gap-2">
            {/* Chatbot button in header */}
            <BettingAssistantButton />

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Chatbot component */}
      <BettingAssistant />
    </>
  );
};

export default Header;
