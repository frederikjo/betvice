import React from "react";
import { Fixture } from "@/services/sportmonks";

type Props = {
  fixture: Fixture | null;
  onClose: () => void;
};

const FixtureModal = ({ fixture, onClose }: Props) => {
  if (!fixture) return null;

  return (
    <div className="bg-black/60 fixed inset-0 z-50 flex items-center justify-center">
      <div className="relative w-full max-w-lg p-6 bg-white rounded shadow">
        <button
          onClick={onClose}
          className="right-3 top-3 absolute text-gray-500"
        >
          Close
        </button>

        <h2 className="mb-2 text-xl font-semibold">{fixture.name}</h2>

        <p className="mb-2">Kickoff: {fixture.starting_at}</p>

        <h3 className="font-semibold">Participants:</h3>
        <ul>
          {fixture.participants?.data.map((p) => (
            <li key={p.id}>
              {p.meta.location.toUpperCase()}: {p.name}
            </li>
          ))}
        </ul>

        <h3 className="mt-4 font-semibold">Odds (if available):</h3>
        <ul>
          {fixture.odds?.data?.map((o) => (
            <li key={o.id}>
              {o.market.name} - {o.label}: {o.value} @{" "}
              {o.bookmaker.name}
            </li>
          )) ?? <p>No odds</p>}
        </ul>
      </div>
    </div>
  );
};

export default FixtureModal;
