import { useState, useEffect, useContext } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Layout from "./Layout";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config/apiConfig";

export default function TurboGames() {
  const { token } = useContext(AuthContext);
  const [games, setGames] = useState([]); // Stores games from API
  const [displayedGames, setDisplayedGames] = useState([]); // Games to display
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [providers, setProviders] = useState([]);

  const [types, setTypes] = useState([]);
  const chunkSize = 20; // Load 20 games at a time
  const navigate = useNavigate();

  const fetchTurboGames = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/turbo-games`
      );
      const data = await response.json();

      if (data.status === "success") {
        setGames(data.turboGames || []);
        setDisplayedGames(data.turboGames.slice(0, chunkSize) || []);
        setHasMore(data.turboGames.length > 0);
      }
    } catch (error) {
      console.error("Error fetching providers and types:", error);
    }
  };

  useEffect(() => {
    fetchTurboGames();
  }, []);

  useEffect(() => {
    if (token) {
      fetchTurboGames();
    }
  }, [token]);

  // Fetch initial games
  useEffect(() => {
    fetchTurboGames();
  }, []);

  // Handle Infinite Scroll
  const fetchMoreGames = () => {
    const nextChunk = games.slice(
      displayedGames.length,
      displayedGames.length + chunkSize
    );
    if (nextChunk.length === 0) {
      setHasMore(false);
    } else {
      setDisplayedGames((prev) => [...prev, ...nextChunk]);
    }
  };

  // Debounce Search Input (Avoid too many API calls)
  useEffect(() => {
    if (search.length < 3) return;

    const timeoutId = setTimeout(() => {
      setPage(1);
      fetchTurboGames(search, 1);
    }, 500); // Delay API request by 500ms

    return () => clearTimeout(timeoutId);
  }, [search]);

  // Launch Game (Open in iFrame)
  const launchGame = async (name) => {
    try {
      console.log("Launching game:", name);
      const currentUrl = window.location.href;
      console.log("Current URL:", currentUrl);
      // return;
      // const currentUrl ="https://Starbuks.in/games";
      const response = await fetch(
        `${BASE_URL}/player/turbo/${name}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: {
            return_url: currentUrl,
          },
        }
      );
      const data = await response.json();
      console.log("Game launch response:", data);
      console.log("Game response:", data.gameUrl);

      if (data.status === "success" && data.gameUrl) {
        navigate(`/games/${data.gameName}`, { state: { gameUrl: data.gameUrl } });
      } else {
        console.error("Invalid game data:", data);
      }
    } catch (error) {
      console.error("Error launching game:", error);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col min-h-screen bg-gray-100 relative">
        {/* Search Bar */}
        <div className="fixed top-0 left-0 w-full bg-white shadow-md mt-14 p-4 z-20">
          <div className="flex items-center gap-4">
            <input
              type="search"
              className="block w-full p-2 text-sm border border-gray-300 rounded-full"
              placeholder="Search Games (Min 3 Letters)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select className="block w-1/3 p-2 text-sm border border-gray-300 rounded-full">
              <option>All Providers</option>
              {providers.map((provider) => (
                <option key={provider.id} value={provider.provider}>
                  {provider.provider}
                </option>
              ))}
            </select>

            <select className="block w-1/3 p-2 text-sm border border-gray-300 rounded-full ml-auto">
              <option>All Type</option>
              {types.map((type) => (
                <option key={type.id} value={type.type}>
                  {type.type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Games List - Infinite Scroll */}
        <div className="pt-24 pb-10 p-2">
          <h3 className="text-lg font-semibold mb-4">All Games</h3>

          <InfiniteScroll
            dataLength={displayedGames.length}
            next={fetchMoreGames}
            hasMore={hasMore}
            loader={<p className="text-center">Loading more games...</p>}
          >
            <div className="grid grid-cols-2 gap-4">
              {displayedGames.map((game, index) => (
                <div
                  key={`${game.uuid}-${index}`} // Ensure unique key
                  className="bg-white p-3 rounded-lg shadow-md text-center cursor-pointer"
                  onClick={() => launchGame(game.value)}
                >
                  <img
                    src={game.imagePath}
                    alt={game.name}
                    className="w-full h-32 object-cover rounded-md mb-2"
                  />
                  <p className="font-semibold">{game.key}</p>
                  <p className="text-sm text-gray-500">{game.value}</p>
                </div>
              ))}
            </div>
          </InfiniteScroll>
        </div>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 w-full bg-white shadow-md p-3 flex justify-around">
          <button className="text-blue-600 font-semibold">Home</button>
          <button className="text-gray-600">Live Games</button>
          <button className="text-gray-600">Casino</button>
        </nav>
      </div>
    </Layout>
  );
}
