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
      <header className="sticky top-0 w-full px-2 py-4 bg-white bg-gray-200 border-b shadow-lg">
        <div className="container flex items-center justify-between mx-auto">
          <h1 className="text-primary text-2xl font-bold">
            Betting Tips
          </h1>
          <div className="flex items-center gap-2">
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
