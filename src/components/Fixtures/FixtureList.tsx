import React, { useEffect, useState } from "react";
import {
  Fixture,
  getFixturesByDate,
  getFixtureById,
} from "@/services/sportmonks";
import FixtureModal from "./FixtureModal";

const FixtureList = () => {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [selectedFixture, setSelectedFixture] =
    useState<Fixture | null>(null);

  useEffect(() => {
    const fetchFixtures = async () => {
      const today = new Date().toISOString().split("T")[0];
      const data = await getFixturesByDate(today);
      setFixtures(data.data);
    };

    fetchFixtures();
  }, []);

  const handleFixtureClick = async (fixtureId: number) => {
    const data = await getFixtureById(fixtureId);
    setSelectedFixture(data.data);
  };

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Today's Fixtures</h1>
      <ul className="space-y-2">
        {fixtures.map((fixture) => (
          <li
            key={fixture.id}
            className="hover:bg-gray-100 p-3 border rounded cursor-pointer"
            onClick={() => handleFixtureClick(fixture.id)}
          >
            {fixture.name} - {fixture.starting_at}
          </li>
        ))}
      </ul>

      {selectedFixture && (
        <FixtureModal
          fixture={selectedFixture}
          onClose={() => setSelectedFixture(null)}
        />
      )}
    </div>
  );
};

export default FixtureList;
