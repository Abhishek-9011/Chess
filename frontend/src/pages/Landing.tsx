import chessBoard from "../images/chessBoard.jpg";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="max-w-6xl w-full flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-8 md:gap-12">
        <div className="flex-1 flex justify-center w-full max-w-lg">
          <div className="relative group w-full">
            <img
              src={chessBoard}
              alt="Chess board"
              className="w-full rounded-xl shadow-2xl border-4 border-amber-500/20 transition-all duration-500 group-hover:border-amber-500/50 group-hover:shadow-amber-500/20"
            />
          </div>
        </div>
        
        <div className="flex-1 text-center lg:text-left max-w-lg">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
            Play Chess Like Never Before
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8">
            Challenge your mind with our beautiful chess experience. Play against friends.
          </p>
          <button
            onClick={() => navigate("/game")}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-6 sm:py-3 sm:px-8 rounded-lg text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-amber-500/30"
          >
            Start Game
          </button>
        </div>
      </div>

      <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 flex justify-center">
        <div className="text-gray-500 text-xs sm:text-sm">
          Press Start to begin your chess journey
        </div>
      </div>
    </div>
  );
};

export default Landing;