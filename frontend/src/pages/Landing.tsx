  import chessBoard from "../images/chessBoard.png";
  import { useNavigate } from "react-router-dom";

  const Landing = () => {
    const navigate = useNavigate();

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-6">
        <div className="max-w-4xl w-full flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1">
            <div className="relative group">
              <img
                src={chessBoard}
                alt="Chess board"
                className="w-full max-w-md rounded-xl shadow-2xl border-4 border-amber-500/20 transition-all duration-500 group-hover:border-amber-500/50 group-hover:shadow-amber-500/20"
              />
              <div className="absolute inset-0 bg-amber-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Play Chess Like Never Before
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Challenge your mind with our beautiful chess experience. Play
              against friends or test your skills against AI.
            </p>
            <button
              onClick={() => navigate("/game")}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-amber-500/30"
            >
              Start Game
            </button>
          </div>
        </div>

          <div className="absolute bottom-6 left-0 right-0 flex justify-center">
          <div className="text-gray-500 text-sm">
            Press Start to begin your chess journey
          </div>
        </div>
      </div>
    );
  };

  export default Landing;
