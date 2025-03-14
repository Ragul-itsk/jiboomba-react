import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import { FiPlusCircle } from "react-icons/fi";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Layout from "./Layout";

const bannerImages = [
  "assets/images/banners/aviator-banner.png",
  "assets/images/banners/gamzix-banner.jpg",
  "assets/images/banners/drops_wins-banner.jpg",
];

const games = [
  { id: 1, name: "Teenpatti", image: "https://stage.gis-static.com/games/SuperSpadeGames/fefb56935028b6efed8dc7fca86004550905a00a.png" },
  { id: 2, name: "Color Prediction", image: "https://stage.gis-static.com/games/TaDaGaming/7f3e848cd71549628d2b848dcc5fdee4.png" },
  { id: 3, name: "Dragon Tiger", image: "https://stage.gis-static.com/games/Rich88/f7468c20b5194dd4856c7564eb7e9bd3.png" },
  { id: 4, name: "Aviator", image: "https://stage.gis-static.com/games/3962be5e18b1e84fdd95613e87dfda1a/Spribe/841d0a6789c74dd4abab65133287af9b.png" },
];

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (user === null) {
    return <p className="text-center text-gray-500 mt-10">Loading...</p>;
  }

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return user ? (
    <Layout>
      <div className="flex flex-col min-h-screen bg-gray-100 relative">
        {/* Top Navbar & Profile Info Fixed */}
        <div className="fixed top-0 left-0 w-full bg-white shadow-md mt-14 z-20">
          <div className="bg-white shadow-md p-4 text-center relative">
            <h2 className="text-xl font-bold">Welcome, {user.player.name}!</h2>
            <div className="flex justify-center">
              <p className="text-gray-600 flex items-center gap-2">
                Chips: {user.player.chips}
                <button
                  className="text-green-500"
                  onClick={() => navigate("/deposit-amount")}
                >
                  <FiPlusCircle />
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="pt-24 pb-10 p-2 z-10">
          {/* Banner Carousel */}
          <Slider {...sliderSettings} className="mb-6">
            {bannerImages.map((image, index) => (
              <div key={index}>
                <img
                  src={image}
                  alt={`Banner ${index + 1}`}
                  className="w-full h-40 object-cover rounded-lg"
                />
              </div>
            ))}
          </Slider>

          {/* Games Section */}
          <h3 className="text-lg font-semibold mb-4">Popular Games <span className="float-right text-base font-normal p-1">All Games</span></h3>
          <div className="grid grid-cols-2 gap-4">
            {games.map((game) => (
              <div key={game.id} className="bg-white p-3 rounded-lg shadow-md">
                <img
                  src={game.image}
                  alt={game.name}
                  className="w-full h-32 object-cover rounded-md"
                />
                <p className="text-center font-semibold mt-2">{game.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Navigation Fixed */}
        <nav className="fixed bottom-0 left-0 w-full bg-white shadow-md p-3 flex justify-around z-10">
          <button className="text-blue-600 font-semibold">Home</button>
          <button className="text-gray-600">Live Games</button>
          <button className="text-gray-600">Casino</button>
        </nav>
      </div>
    </Layout>
  ) : (
    <Navigate to="/login" />
  );
}
