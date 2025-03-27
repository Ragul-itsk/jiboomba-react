import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Layout from "./Layout";

export default function Providers() {
  const [providers, setProviders] = useState([]);
  const [displayedProviders, setDisplayedProviders] = useState([]);
  const [search, setSearch] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const chunkSize = 10; // Load 10 at a time

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch("https://staging.syscorp.in/api/v1/starbuks/all-games");
        const data = await response.json();
        if (data.status === "success") {
          const groupedProviders = groupByProvider(data.allGames);
          setProviders(groupedProviders);
          setDisplayedProviders(groupedProviders.slice(0, chunkSize)); // Initial 10
        }
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    fetchGames();
  }, []);

  // Group by provider and count mobile games
  const groupByProvider = (games) => {
    const providerMap = {};
    games.forEach((game) => {
      if (!providerMap[game.provider]) {
        providerMap[game.provider] = { name: game.provider, totalGames: 0 };
      }
      if (game.is_mobile) {
        providerMap[game.provider].totalGames += 1;
      }
    });
    return Object.values(providerMap);
  };

  // Load more providers on scroll
  const fetchMoreProviders = () => {
    const nextChunk = providers.slice(displayedProviders.length, displayedProviders.length + chunkSize);
    if (nextChunk.length === 0) {
      setHasMore(false);
    } else {
      setDisplayedProviders((prev) => [...prev, ...nextChunk]);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col min-h-screen bg-gray-100 relative">
        
        {/* Search Bar */}
        <div className="fixed top-0 left-0 w-full bg-white shadow-md mt-14 p-4 z-20">
          <input
            type="search"
            className="block w-full p-2 text-sm border border-gray-300 rounded-full"
            placeholder="Search Providers"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Providers List - Infinite Scroll */}
        <div className="pt-24 pb-10 p-2">
          <h3 className="text-lg font-semibold mb-4">All Providers</h3>
          <InfiniteScroll
            dataLength={displayedProviders.length}
            next={fetchMoreProviders}
            hasMore={hasMore}
            loader={<p className="text-center">Loading more providers...</p>}
          >
            <div className="grid grid-cols-2 gap-4">
              {displayedProviders.map((provider, index) => (
                <div key={index} className="bg-white p-3 rounded-lg shadow-md text-center">
                  <p className="font-semibold">{provider.name}</p>
                  <p className="text-sm text-gray-500">{provider.totalGames} Mobile Games</p>
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
