import { useLocation, useParams } from "react-router-dom";
import Layout from "./Layout"
const GamePage = () => {
    const { gameName } = useParams();
    const location = useLocation();
    const gameUrl = location.state?.gameUrl; // Get URL from navigation state

    // if (!gameUrl) {
    //     return <div className="text-center text-red-500">Error: No game URL found.</div>;
    // }

    return (
        <div className="h-screen bg-green-500 flex flex-col">
            <iframe src={gameUrl} className="w-auto" ></iframe>
        </div>
    );
};

export default GamePage;
