// src/components/Layout.tsx
import React from "react";
import Header from "./Header";
import BettingAssistantProvider from "./ai-bot/BettingAssistantProvider";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <BettingAssistantProvider>
      <div className="bg-background w-full min-h-screen">
        <Header />

        <main className="container px-4 py-6 mx-auto">
          {children}
        </main>

        <footer className="bg-background text-muted-foreground p-4 text-sm text-center border-t">
          <div className="container mx-auto">
            <p>
              © {new Date().getFullYear()} Betting Tips App. All
              rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </BettingAssistantProvider>
  );
};

export default Layout;
