import React, { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "./ui/button";
import BettingAssistantButton from "./ai-bot/BettingAssistantButton";
import BettingAssistant from "./ai-bot/BettingAssistant";
import BetviseLogo from "../assets/BetviseLogo.svg";
import Icon from "./ui/Icon";

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-gradient-to-r from-white to-[#F0F4F8] border-b border-gray-100 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="container flex items-center justify-between px-4 py-3 mx-auto">
          <Icon
            icon="BetviseLogo"
            width="120"
            height="60"
            className="hover:opacity-90 transition-opacity cursor-pointer"
          />

          <div className="flex items-center gap-2">
            <BettingAssistantButton />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="text-betvise-blue hover:text-betvise-berry hover:bg-background-100 dark:text-betvise-cream dark:hover:bg-betvise-blue-700"
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
