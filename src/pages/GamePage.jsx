import { useLocation, useParams } from "react-router-dom";
import Layout from "./Layout"
const GamePage = () => {
    const { gameName } = useParams();
    const location = useLocation();
    const gameUrl = location.state?.gameUrl; // Get URL from navigation state

    if (!gameUrl) {
        return <div className="text-center text-red-500">Error: No game URL found.</div>;
    }

    return (
        <div className="flex flex-col h-screen">
            <h1 className="text-xl font-bold text-center p-4 bg-gray-800 text-white">{gameName}</h1>
            <div className="flex-grow flex justify-center items-center">
                <iframe 
                    src={gameUrl} 
                    className="w-full h-full max-w-screen max-h-screen"
                    style={{ border: "none" }}
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    );
};

export default GamePage;
