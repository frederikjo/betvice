// src/App.tsx
import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import PerformanceTrackerPage from "./pages/PerformanceTrackerPage";
import BettingTipsPage from "./pages/BettingTipsPage";
import BettingAssistantProvider from "./components/ai-bot/BettingAssistantProvider";

function App() {
  return (
    <BettingAssistantProvider>
      <Suspense fallback={<p>Loading...</p>}>
        <div className="bg-background text-foreground min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/performance"
              element={<PerformanceTrackerPage />}
            />
            <Route
              path="/betting-tips"
              element={<BettingTipsPage />}
            />
          </Routes>
        </div>
      </Suspense>
    </BettingAssistantProvider>
  );
}

export default App;
