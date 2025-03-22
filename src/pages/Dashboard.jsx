import { useContext, useState, useEffect} from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import { FiPlusCircle } from "react-icons/fi";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import Layout from "./Layout";
import { a, style } from "framer-motion/client";


const bannerImages = [
  "assets/images/banners/aviator-banner.png",
  "assets/images/banners/gamzix-banner.jpg",
  "assets/images/banners/drops_wins-banner.jpg",
];

  const games = [
    { id: 1, name: "Teenpatti", image: "https://stage.gis-static.com/games/SuperSpadeGames/fefb56935028b6efed8dc7fca86004550905a00a.png", link: "https://slotuat.ssc-live.com/game/" },
    { id: 2, name: "Color Prediction", image: "https://stage.gis-static.com/games/TaDaGaming/7f3e848cd71549628d2b848dcc5fdee4.png",link: "https://uat-wbgame.tadagaming.com/colorprediction/?ssoKey=975dfa075ef4c3ab8d392b48949760b2ed96d25e&lang=en-US&apiId=10310&be=moc.gnimagadat.ipabewbw-tau&domain_gs=gnimagadat&domain_platform=moc.gnimagadat.df-tolsbw-tau&gameID=204&gs=moc.gnimagadat.df-tolsbw-tau&iu=true&legalLang=true&skin=1&region=na" },
    { id: 3, name: "Dragon Tiger", image: "https://stage.gis-static.com/games/Rich88/f7468c20b5194dd4856c7564eb7e9bd3.png",link: "https://beta.r88-gaming.com/game/board/DragonTiger/?=lezuanqipai=14-A=sl6I!jB^{xCo$r_$bD|^IA{_Kvb+LtHc]cGQpcHvNv5{uI5trxM[5FhVSwO17KPB]E5]oQ91VN75nVm!MKSFcRVIWKa6vMrJE~tGEKWMWIvM+QwNYEv{cw$z)Pog-P$C@UnyZZ(=pC(]DVEUr({X}ZpkK!GYT[IVTZJ~s*|!t^J952[J+Qwu})3P__2wH-3x93Q+[1HQNVI(C}7gI}HS3-W-F^X[5}c]69ID@]ZHj_~2c5eKh6gGM3hL}(U$^_SNhjj4dhRP4l_Qg|_xtqn_h[VTjfr=fprS+]!f)esg]s1{~iuE(i*]qwvkyk{Zn6+[gmAJ7e8kub|ljp9qBrasCI0PHFEPMF-_gueweXHgDVfTg^JwlZeAm~7y3HdCM@O2Ikl)O^b3nNSok3g{ssc8~tk0jAVqsPqHR]Zb~0jJL-YdjUw2pblP~ZoRDIng-*vPRD_jW$xVzeri{@zE)8}2K)wZXQzcHIC~s4-L]qE@LfDgQNKuYQ4v4tIwc)IbU}Q)Jq4)F]MBL@RUhXST[rPW4AS=XrPs@cYT2@fH4FP2K2Unp7$!arhqbt!J5whO5k(tQLk)4t@RkQ(^tm^b[ona|jrz-f(_=u|V(=]W4V=YW0=M~w2i[bw4[B]ZEm=HFt1JaGBS8zBa1QB)-x5qGKH)nAE7IXF++g9fiSLufDLTgpeidibzmMPi3nfCg_hmMQg)S_S~!-a6QImpNKnsm)UFrJsIY~kHR]ZKW3XuDPtx{cmMJ}qMu$oBzTAPD($6}a_TtTpA!{)1r(D2o+pkJXzH||vG!ZvG)}-7t^1!y3]t-$Cr@=xw|22bu$2)z}4K=VPfZ+6{T6Sgz88CeYFAZaJU590[H|YGi)JE$fNY9ed3g3SH6^RrJ]R@ca*7L0*tQ7k9q9YMgvnRdfnxUNnc^fqQjnXV(drfyc[C$i1dn5!Xxy2j}ww~zr5HEB*Zgmyoyk8o)f9qwm0MtBaq=tDtzvbQIDJqAhJgCdfsqwIyIuLUhKiVuChXbzNlwEQiIpRoKlnAyEQGQCT$ZUUrdXWreYWpPwtaNUY)$Vecv$u{Yv!zN!@g^MzB*QjeEVASN+CPNT*V*R_2=++Gs|}Gt=Hp_Yxp6Y|L}$wH__[7y31^@1]a}VMb|{ytTX4y0{DO[+7{]9T{C}0)1YEy26FD_0Wj18Y}5@IEivW-7aKI5!!3@c@4ad^4Rehrg5i)pnQL{8ZCRPV+wF@)6M^{hl^aVPZ|-z+RkoYWitt]$rtDwk!W5iw5qw46Dlz65yyZsw(*ye7pDv8K|oDNBtFcCobc[DbtcF-_guGgKmJhGj304EKy9KNWSALkjB0ifNkY9N9ZKGSoGRo!IQpCcGT$KXroe^W0MOW(c6WLmOZ9hMitU^@yRF~Pl!idCQ^C{R^CBTA[~W_EWUqB@F)WoY+4yUG4T}|52W-K7XJ!|@=95=1J+QKG}$N0BeJjCrzwE1AyR9Qef]7B5!Sh028|e+9XJ29=F=NFl=b!a3MX88emOig42gfqa}@r49$r*7isP4i_)cj+4f+v*1TO=2oTueY+jjqy~us[hu=B[7vf$ntUn52ZlswFBt$!znxl_iz8tz5KC0B9Go=$nz+)FtDr=oFdzFaQQsGfNx=+hJ2cDygx|KfVxOLU6QLBPD4[nB5[wCmnWOQZaSS6bCSGZXU$KMrIPVYsfAZLJNd9x~hsTOwNb~v{}RxQ^x$g_Qph=Q^D$Voz~+DU*))VjY_m}T}HtUH4!+IV*Msm)Q-16" },
    { id: 4, name: "Aviator", image: "https://stage.gis-static.com/games/3962be5e18b1e84fdd95613e87dfda1a/Spribe/841d0a6789c74dd4abab65133287af9b.png",link: "https://aviator.staging.spribe.dev/?user=qt676-9172086c0457013b00330033EUR&token=qt676-5dca9a80bf5a4dc981b4cb2c66a99382G-CIS&lang=EN&currency=EUR&currency=EUR&operator=qtech_stg&return_url=https:%2F%2Fstaging.slotegrator.com%2Fapi%2Findex.php%2Fexit%2FYzNtTmxRTWhkU0xzUmNxcjYvUzhiRkxFSGZjYnFBV3pJMHlCOGVEbnRYTnNVN3lIUGhEbUdpaHNZNUp4ZG05Ng%253D%253D%2F75ffd236e0ac4b70a4decef1ee503632%2F2b4757d772063670f6f289115a25eddb81f98dff&gameId=aviator&mode=real&sessionToken=qt676-5dca9a80bf5a4dc981b4cb2c66a99382G-CIS&language=en_US&returnUrl=https:%2F%2Fstaging.slotegrator.com%2Fapi%2Findex.php%2Fexit%2FYzNtTmxRTWhkU0xzUmNxcjYvUzhiRkxFSGZjYnFBV3pJMHlCOGVEbnRYTnNVN3lIUGhEbUdpaHNZNUp4ZG05Ng%253D%253D%2F75ffd236e0ac4b70a4decef1ee503632%2F2b4757d772063670f6f289115a25eddb81f98dff&operatorId=qtech_stg&device=mobile&playerId=qt676-9172086c0457013b00330033EUR" },
  ];

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      if (!user) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
      }
      setLoading(false);
    };
    checkAuth();
  }, [user]);

  if (loading) {
    return <p className="text-center text-gray-500 mt-10">Loading...</p>;
  }

  if (!user) {
    navigate("/login");
    return null;
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
            <h2 className="text-xl font-bold">Welcome, {user.player.playername}!</h2>
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
          <Link to="/games">
          <h3 className="text-lg font-semibold mb-4">Popular Games <span className="float-right text-base font-normal p-1">All Games</span></h3>
          </Link>
          <div className="grid grid-cols-2 gap-4">
  {games.map((game) => (
    <a 
      key={game.id} 
      href={game.link} 
      target="_blank" 
      rel="noopener noreferrer"
      className="bg-white p-3 rounded-lg shadow-md block"
    >
      <img
        src={game.image}
        alt={game.name}
        className="w-full h-32 object-cover rounded-md"
      />
      <p className="text-center font-semibold mt-2">{game.name}</p>
    </a>
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
