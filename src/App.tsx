import { Suspense, useEffect, useState } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import routes from "tempo-routes";
import BettingAssistantProvider from "./components/ai-bot/BettingAssistantProvider";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme from local storage or system preference
  useEffect(() => {
    // Check if user previously set a theme preference
    const storedTheme = localStorage.getItem("theme");

    if (storedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else if (storedTheme === "light") {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    } else {
      // Use system preference as fallback
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setIsDarkMode(prefersDark);
      if (prefersDark) {
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <BettingAssistantProvider>
      <Suspense fallback={<p>Loading...</p>}>
        <div
          className={`min-h-screen bg-background text-foreground ${
            isDarkMode ? "dark" : "light"
          }`}
        >
          <Routes>
            <Route
              path="/"
              element={
                <Home
                // isDarkMode={isDarkMode}
                // toggleTheme={toggleTheme}
                />
              }
            />
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        </div>
      </Suspense>
    </BettingAssistantProvider>
  );
}

export default App;
