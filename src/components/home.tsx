import React from "react";
import Header from "@/components/Header";
import FixtureList from "./Fixtures/FixtureList";

/**
 * Simplified Home component that just uses the Header and FixtureList
 * without the tabs interface
 */
const Home: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Use your existing Header component */}
      <Header />

      <main className="container px-4 py-6 mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Today's Fixtures
          </h1>
          <p className="text-gray-600">
            All football matches scheduled for today
          </p>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <FixtureList />
        </div>
      </main>
    </div>
  );
};

export default Home;
