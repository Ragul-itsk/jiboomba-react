import { useState, useEffect, useContext } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Layout from "./Layout";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Games() {
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

  const fetchProviders = async () => {
    try {
      const response = await fetch(
        "https://staging.syscorp.in/api/v1/starbuks/providers-list"
      );
      const data = await response.json();

      if (data.status === "success") {
        setProviders(data.providers);
        setTypes(data.types);
      }
    } catch (error) {
      console.error("Error fetching providers and types:", error);
    }
  };

  // Fetch Games (Pagination & Search)
  const fetchGames = async (query = "", pageNumber = 1) => {
    try {
      const url =
        query.length >= 3
          ? `https://staging.syscorp.in/api/v1/starbuks/all-games?search=${query}&page=${pageNumber}&limit=50`
          : `https://staging.syscorp.in/api/v1/starbuks/all-games?page=${pageNumber}&limit=50`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "success") {
        const newGames = data.allGames || [];
        setGames(pageNumber === 1 ? newGames : [...games, ...newGames]);
        setDisplayedGames(
          pageNumber === 1
            ? newGames.slice(0, chunkSize)
            : [...displayedGames, ...newGames.slice(0, chunkSize)]
        );
        setHasMore(newGames.length > 0);
      }
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };

  useEffect(() => {
    fetchProviders();
    fetchGames();
  }, []);

  useEffect(() => {
    if (token) {
      fetchGames();
    }
  }, [token]);

  // Fetch initial games
  useEffect(() => {
    fetchGames();
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
      fetchGames(search, 1);
    }, 500); // Delay API request by 500ms

    return () => clearTimeout(timeoutId);
  }, [search]);

  // Launch Game (Open in iFrame)
  const launchGame = async (provider, name, uuid) => {
    try {
      // const currentUrl = window.location.href;
      const currentUrl = "https://starbuks.in/games";
      const response = await fetch(
        `https://staging.syscorp.in/api/v1/starbuks/player/${provider}/launch/${name}/${uuid}?return_url=${encodeURIComponent(
          currentUrl
        )}`,
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
      console.log(data);

      if (data.status === "success" && data.game?.gameUrl) {
        navigate(`/games/${name}`, { state: { gameUrl: data.game.gameUrl } });
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
                  onClick={() =>
                    launchGame(game.provider, game.name, game.uuid)
                  }
                >
                  <img
                    src={game.image}
                    alt={game.name}
                    className="w-full h-32 object-cover rounded-md mb-2"
                  />
                  <p className="font-semibold">{game.name}</p>
                  <p className="text-sm text-gray-500">{game.type}</p>
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
