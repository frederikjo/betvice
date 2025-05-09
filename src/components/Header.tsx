import React, { useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "./ui/button";
import BettingAssistantButton from "./ai-bot/BettingAssistantButton";
import BettingAssistant from "./ai-bot/BettingAssistant";
import BetviseLogo from "../assets/BetviseLogo.svg";
import Icon from "./ui/Icon";

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");

    if (!isDarkMode) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <>
      <header className="bg-betvise-cream border-betvise-stone/20 dark:bg-betvise-blue-800 dark:border-betvise-blue-700 sticky top-0 w-full px-2 py-3 border-b shadow-sm">
        <div className="container flex items-center justify-between mx-auto">
          <Icon icon="BetviseLogo" />

          <div className="flex items-center gap-2">
            <BettingAssistantButton />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="text-betvise-blue hover:text-betvise-berry hover:bg-betvise-cream-100 dark:text-betvise-cream dark:hover:bg-betvise-blue-700"
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

      <BettingAssistant />
    </>
  );
};

export default Header;
