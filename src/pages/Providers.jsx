import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Layout from "./Layout";

export default function Providers() {
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchGames = async () => {
    try {
      const response = await fetch(`https://staging.syscorp.in/api/jiboomba/all-games?page=${page}`);
      const data = await response.json();

      if (data.status === "success") {
        const groupedProviders = groupByProvider(data.allGames);
        setProviders((prev) => [...prev, ...groupedProviders]);
        setFilteredProviders((prev) => [...prev, ...groupedProviders]);
        setPage(page + 1);
        setHasMore(data.allGames.length > 0);
      }
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };

  // Group games by provider and count mobile-compatible games
  const groupByProvider = (games) => {
    const providerMap = {};

    games.forEach((game) => {
      if (!providerMap[game.provider]) {
        providerMap[game.provider] = {
          name: game.provider,
          totalGames: 0,
        };
      }
      if (game.is_mobile) {
        providerMap[game.provider].totalGames += 1;
      }
    });

    return Object.values(providerMap);
  };

  useEffect(() => {
    fetchGames();
  }, []);

  // Search Function
  useEffect(() => {
    const filtered = providers.filter((provider) =>
      provider.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredProviders(filtered);
  }, [search, providers]);

  return (
    <Layout>
      <div className="flex flex-col min-h-screen bg-gray-100 relative">
        
        {/* Search Bar */}
        <div className="fixed top-0 left-0 w-full bg-white shadow-md mt-14 p-4 z-20">
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" aria-hidden="true" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input
              type="search"
              className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search Providers"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Providers List with Infinite Scroll */}
        <div className="pt-24 pb-10 p-2 z-10">
          <h3 className="text-lg font-semibold mb-4">All Providers</h3>
          
          <InfiniteScroll
            dataLength={filteredProviders.length}
            next={fetchGames}
            hasMore={hasMore}
            loader={<p className="text-center text-gray-500">Loading more providers...</p>}
            endMessage={<p className="text-center text-gray-500">No more providers.</p>}
          >
            <div className="grid grid-cols-2 gap-4">
              {filteredProviders.map((provider, index) => (
                <div key={index} className="bg-white p-3 rounded-lg shadow-md text-center">
                  <p className="font-semibold">{provider.name}</p>
                  <p className="text-sm text-gray-500">{provider.totalGames} Mobile Games</p>
                </div>
              ))}
            </div>
          </InfiniteScroll>
        </div>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 w-full bg-white shadow-md p-3 flex justify-around z-10">
          <button className="text-blue-600 font-semibold">Home</button>
          <button className="text-gray-600">Live Games</button>
          <button className="text-gray-600">Casino</button>
        </nav>
      </div>
    </Layout>
  );
}
