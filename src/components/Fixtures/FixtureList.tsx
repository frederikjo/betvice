// import React, { useState, useEffect } from "react";
// import { format } from "date-fns";
// import { Loader2, AlertCircle } from "lucide-react";
// import apiService from "@/services/api";
// import axios from "axios";

// // Updated interfaces to match the actual API response
// interface ParticipantMeta {
//   location: string;
//   winner: boolean | null;
//   position: number;
// }

// interface Participant {
//   id: number;
//   name: string;
//   image_path?: string;
//   meta?: ParticipantMeta;
//   // Any other properties that might exist
//   [key: string]: any;
// }

// interface ScoreDetails {
//   goals: number;
//   participant: string;
// }

// interface Score {
//   id: number;
//   fixture_id: number;
//   type_id: number;
//   participant_id: number;
//   score: ScoreDetails;
//   description: string;
// }

// interface Fixture {
//   id: number;
//   starting_at: string;
//   status?: string;
//   state_id?: number;
//   participants: Participant[];
//   scores?: Score[];
//   // Other fields - using an index signature for flexibility
//   [key: string]: any;
// }

// interface Stage {
//   id: number;
//   name: string;
//   // Other fields
//   [key: string]: any;
// }

// interface League {
//   id: number;
//   name: string;
//   country_id: number; // API returns country_id, not country object
//   image_path?: string;
//   today: Fixture[]; // Fixtures are in 'today' property
//   // Other fields
//   [key: string]: any;
// }

// // API response structure
// interface ApiResponse {
//   data: League[];
//   pagination?: any;
//   subscription?: any;
//   rate_limit?: any;
//   timezone?: string;
// }

// const FixtureList: React.FC = () => {
//   const [leagues, setLeagues] = useState<League[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   // In your FixtureList component, modify the fetchFixtures function:

//   useEffect(() => {
//     const fetchFixtures = async () => {
//       try {
//         setLoading(true);

//         // Get today's date in YYYY-MM-DD format
//         const today = format(new Date(), "yyyy-MM-dd");

//         // Use the new inplay livescores endpoint instead
//         const response =
//           await apiService.sportmonks.football.getInplayLivescores();

//         console.log("API Response FOO:", response);

//         // Validate and process the response data
//         if (response && response.data) {
//           console.log(
//             "Response data structure:",
//             JSON.stringify(response.data, null, 2)
//           );

//           // Group fixtures by league
//           const fixturesByLeague: { [key: number]: Fixture[] } = {};
//           const leagueDetails: { [key: number]: any } = {};

//           // Process each fixture and group by league
//           response.data.forEach((fixture: Fixture) => {
//             // Check if league information is included in the fixture
//             if (fixture.league) {
//               const leagueId = fixture.league.id;

//               // Store league details
//               if (!leagueDetails[leagueId]) {
//                 leagueDetails[leagueId] = fixture.league;
//               }

//               // Add fixture to the league group
//               if (!fixturesByLeague[leagueId]) {
//                 fixturesByLeague[leagueId] = [];
//               }
//               fixturesByLeague[leagueId].push(fixture);
//             }
//           });

//           // Convert to leagues array format
//           const leaguesData = Object.keys(fixturesByLeague).map(
//             (leagueId) => {
//               const numericLeagueId = Number(leagueId);
//               const league = leagueDetails[numericLeagueId];
//               return {
//                 id: numericLeagueId,
//                 name: league.name,
//                 country_id: league.country_id,
//                 image_path: league.image_path,
//                 short_code: league.short_code,
//                 // Put fixtures in 'today' property to maintain compatibility
//                 today: fixturesByLeague[numericLeagueId],
//                 ...league,
//               };
//             }
//           );

//           setLeagues(leaguesData as League[]);
//         } else {
//           setError("No data received from API");
//         }

//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching fixtures:", err);
//         setError("Failed to load fixtures. Please try again later.");
//         setLoading(false);
//       }
//     };

//     fetchFixtures();
//   }, []);
//   // useEffect(() => {
//   //   const fetchFixtures = async () => {
//   //     try {
//   //       setLoading(true);

//   //       // Get today's date in YYYY-MM-DD format
//   //       const today = format(new Date(), "yyyy-MM-dd");

//   //       // Use our API service
//   //       const response =
//   //         await apiService.sportmonks.football.getFixturesByDate(
//   //           today
//   //         );

//   //       console.log("Pagination:", response.pagination);
//   //       console.log("Found leagues:", response.data.length);

//   //       // Validate and process the response data
//   //       if (response && response.data) {
//   //         // Set leagues data
//   //         setLeagues(
//   //           response.data.map((league: any) => ({
//   //             id: league.id,
//   //             name: league.name,
//   //             country_id: league.country_id,
//   //             image_path: league.image_path,
//   //             today: league.today || [],
//   //             ...league,
//   //           })) as League[]
//   //         );
//   //       } else {
//   //         setError("No data received from API");
//   //       }

//   //       setLoading(false);
//   //     } catch (err) {
//   //       console.error("Error fetching fixtures:", err);
//   //       setError("Failed to load fixtures. Please try again later.");
//   //       setLoading(false);
//   //     }
//   //   };

//   //   fetchFixtures();
//   // }, []);

//   // Helper function to get the current score for a fixture
//   const getCurrentScore = (scores: Score[] | undefined) => {
//     if (!scores || !Array.isArray(scores) || scores.length === 0) {
//       return { home: 0, away: 0 };
//     }

//     // Find CURRENT scores
//     const homeScore = scores.find(
//       (s) =>
//         s.description === "CURRENT" && s.score.participant === "home"
//     );
//     const awayScore = scores.find(
//       (s) =>
//         s.description === "CURRENT" && s.score.participant === "away"
//     );

//     return {
//       home: homeScore?.score.goals || 0,
//       away: awayScore?.score.goals || 0,
//     };
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center py-12">
//         <Loader2 className="animate-spin w-6 h-6 text-blue-500" />
//         <p className="ml-2 text-gray-700">
//           Loading today's fixtures...
//         </p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center py-8 text-red-500">
//         <AlertCircle className="w-6 h-6 mr-2" />
//         <p>{error}</p>
//       </div>
//     );
//   }

//   if (leagues.length === 0) {
//     return (
//       <div className="py-8 text-center text-gray-500">
//         <p>No fixtures scheduled for today.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center mb-2 text-sm text-gray-600">
//         <span>{format(new Date(), "MMMM d, yyyy")}</span>
//       </div>

//       {leagues.map((league) => (
//         <div
//           key={league.id}
//           className="overflow-hidden border rounded-lg shadow-sm"
//         >
//           <div className="px-4 py-3 bg-gray-100 border-b">
//             <h3 className="font-semibold">{league.name}</h3>
//             <p className="text-xs text-gray-600">
//               {/* Country info not directly available, using league names or codes instead */}
//               {league.short_code || "League"}
//             </p>
//           </div>

//           {Array.isArray(league.today) && league.today.length > 0 ? (
//             <div className="divide-y">
//               {league.today.map((fixture) => {
//                 if (
//                   !fixture ||
//                   !Array.isArray(fixture.participants) ||
//                   fixture.participants.length < 2
//                 ) {
//                   return null;
//                 }

//                 // Find home and away teams
//                 const homeTeam =
//                   fixture.participants.find(
//                     (p) => p?.meta?.location === "home"
//                   ) || fixture.participants[0];
//                 const awayTeam =
//                   fixture.participants.find(
//                     (p) => p?.meta?.location === "away"
//                   ) || fixture.participants[1];

//                 // Get current score
//                 const currentScore = getCurrentScore(fixture.scores);

//                 // Determine match status
//                 const matchStatus =
//                   fixture.state_id === 2
//                     ? "LIVE"
//                     : fixture.state_id === 3
//                     ? "FINISHED"
//                     : "SCHEDULED";

//                 return (
//                   <div
//                     key={fixture.id}
//                     className="hover:bg-gray-50 px-4 py-3"
//                   >
//                     <div className="flex items-center justify-between mb-1">
//                       <span className="text-xs text-gray-500">
//                         {fixture.starting_at
//                           ? format(
//                               new Date(fixture.starting_at),
//                               "HH:mm"
//                             )
//                           : "TBD"}
//                       </span>
//                       <span className="text-xs px-2 py-0.5 bg-gray-200 rounded-full">
//                         {matchStatus}
//                       </span>
//                     </div>

//                     <div className="grid items-center grid-cols-7">
//                       <div className="flex items-center col-span-3">
//                         {homeTeam?.image_path && (
//                           <img
//                             src={homeTeam.image_path}
//                             alt={homeTeam.name}
//                             className="object-contain w-5 h-5 mr-2"
//                           />
//                         )}
//                         <span className="text-sm truncate">
//                           {homeTeam?.name || "Home Team"}
//                         </span>
//                       </div>

//                       <div className="col-span-1 text-sm font-semibold text-center">
//                         {matchStatus === "LIVE" ||
//                         matchStatus === "FINISHED" ? (
//                           <span>
//                             {currentScore.home} - {currentScore.away}
//                           </span>
//                         ) : (
//                           <span>vs</span>
//                         )}
//                       </div>

//                       <div className="flex items-center justify-end col-span-3">
//                         <span className="text-sm truncate">
//                           {awayTeam?.name || "Away Team"}
//                         </span>
//                         {awayTeam?.image_path && (
//                           <img
//                             src={awayTeam.image_path}
//                             alt={awayTeam.name}
//                             className="object-contain w-5 h-5 ml-2"
//                           />
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           ) : (
//             <div className="p-4 text-center text-gray-500">
//               <p>No fixtures available for this league</p>
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default FixtureList;
// src/components/FixtureList.tsx
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import sportsApi, {
  CommonLeague,
  SportsApiProvider,
} from "@/services/sports-api";

const FixtureList: React.FC = () => {
  const [leagues, setLeagues] = useState<CommonLeague[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeProvider, setActiveProvider] =
    useState<SportsApiProvider>(sportsApi.getActiveProvider());
  const [activeTab, setActiveTab] = useState<"live" | "today">(
    "live"
  );

  useEffect(() => {
    fetchData();
  }, [activeProvider, activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get today's date in YYYY-MM-DD format
      const today = format(new Date(), "yyyy-MM-dd");

      let response;
      if (activeTab === "live") {
        // Get live matches
        response = await sportsApi.football.getLiveMatches();
      } else {
        // Get today's matches
        response = await sportsApi.football.getMatchesByDate(today);
      }

      setLeagues(response);
      setLoading(false);
    } catch (err) {
      console.error(`Error fetching ${activeTab} fixtures:`, err);
      setError(
        `Failed to load ${activeTab} fixtures. Please try again later.`
      );
      setLoading(false);
    }
  };

  const handleProviderChange = (provider: SportsApiProvider) => {
    sportsApi.setProvider(provider);
    setActiveProvider(provider);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin w-6 h-6 text-blue-500" />
        <p className="ml-2 text-gray-700">
          Loading {activeTab} fixtures...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8 text-red-500">
        <AlertCircle className="w-6 h-6 mr-2" />
        <p>{error}</p>
        <button
          onClick={fetchData}
          className="p-2 ml-4 text-blue-700 bg-blue-100 rounded-full"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    );
  }

  if (leagues.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        <p>No {activeTab} fixtures available.</p>
        <button
          onClick={fetchData}
          className="px-4 py-2 mt-4 text-blue-700 bg-blue-100 rounded-md"
        >
          <RefreshCw className="inline-block w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-600">
          <span>{format(new Date(), "MMMM d, yyyy")}</span>
        </div>

        <div className="flex space-x-2">
          {/* Data source selector */}
          <div className="p-1 text-xs bg-gray-100 rounded-md">
            <span className="mr-2">Provider:</span>
            <select
              value={activeProvider}
              onChange={(e) =>
                handleProviderChange(
                  e.target.value as SportsApiProvider
                )
              }
              className="px-2 py-1 text-sm bg-white border rounded"
            >
              {sportsApi.getAvailableProviders().map((provider) => (
                <option key={provider} value={provider}>
                  {provider === "sportmonks"
                    ? "SportMonks"
                    : provider === "theOddsApi"
                    ? "The Odds API"
                    : provider}
                </option>
              ))}
            </select>
          </div>

          {/* Tab selector */}
          <div className="flex overflow-hidden border rounded-md">
            <button
              onClick={() => setActiveTab("live")}
              className={`px-3 py-1 text-sm font-medium ${
                activeTab === "live"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              Live
            </button>
            <button
              onClick={() => setActiveTab("today")}
              className={`px-3 py-1 text-sm font-medium ${
                activeTab === "today"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              Today
            </button>
          </div>

          {/* Refresh button */}
          <button
            onClick={fetchData}
            className="hover:bg-gray-200 p-1 bg-gray-100 rounded-md"
            title="Refresh data"
          >
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {leagues.map((league) => (
        <div
          key={league.id}
          className="overflow-hidden border rounded-lg shadow-sm"
        >
          <div className="flex items-center px-4 py-3 bg-gray-100 border-b">
            {league.logo && (
              <img
                src={league.logo}
                alt={league.name}
                className="object-contain w-6 h-6 mr-2"
              />
            )}
            <div>
              <h3 className="font-semibold">{league.name}</h3>
              {league.country && (
                <p className="text-xs text-gray-600">
                  {league.country}
                </p>
              )}
            </div>
          </div>

          {Array.isArray(league.fixtures) &&
          league.fixtures.length > 0 ? (
            <div className="divide-y">
              {league.fixtures.map((fixture) => (
                <div
                  key={fixture.id}
                  className={`hover:bg-gray-50 px-4 py-3 ${
                    fixture.status.status === "live"
                      ? "bg-green-50"
                      : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">
                      {fixture.startTime
                        ? format(new Date(fixture.startTime), "HH:mm")
                        : "TBD"}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        fixture.status.status === "live"
                          ? "bg-green-200 text-green-800"
                          : fixture.status.status === "finished"
                          ? "bg-gray-200 text-gray-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {fixture.status.status.toUpperCase()}
                      {fixture.status.status === "live" &&
                        fixture.status.elapsed &&
                        ` ${fixture.status.elapsed}'`}
                    </span>
                  </div>

                  <div className="grid items-center grid-cols-7">
                    <div className="flex items-center col-span-3">
                      {fixture.homeTeam?.logo && (
                        <img
                          src={fixture.homeTeam.logo}
                          alt={fixture.homeTeam.name}
                          className="object-contain w-5 h-5 mr-2"
                        />
                      )}
                      <span className="text-sm truncate">
                        {fixture.homeTeam?.name || "Home Team"}
                      </span>
                    </div>

                    <div className="col-span-1 text-sm font-semibold text-center">
                      {fixture.status.status === "live" ||
                      fixture.status.status === "finished" ? (
                        <span>
                          {fixture.score.home} - {fixture.score.away}
                        </span>
                      ) : (
                        <span>vs</span>
                      )}
                    </div>

                    <div className="flex items-center justify-end col-span-3">
                      <span className="text-sm truncate">
                        {fixture.awayTeam?.name || "Away Team"}
                      </span>
                      {fixture.awayTeam?.logo && (
                        <img
                          src={fixture.awayTeam.logo}
                          alt={fixture.awayTeam.name}
                          className="object-contain w-5 h-5 ml-2"
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              <p>No fixtures available for this league</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FixtureList;
