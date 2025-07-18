import ChessBoard from "../components/ChessBoard";
import { useSocket } from "../hooks/useSocket";
import { useEffect, useState } from "react";
import { Chess } from "chess.js";
import { INIT_GAME, MOVE, PENDING_STATE } from "../config/messages";

const Game = () => {
  interface Move {
    by: string;
    from: string;
    to: string;
  }
  const socket = useSocket();
  const [chess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [started, setStarted] = useState(false);
  const [color, setColor] = useState("");
  const [pending, setPending] = useState(false);
  const [moves, setMoves] = useState([]);
  useEffect(() => {
    if (!socket) return;
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case INIT_GAME:
          const assignedColor = message.payload.color;
          setColor(assignedColor);
          setBoard(chess.board());
          setStarted(true);
          setPending(false);
          break;
        case PENDING_STATE:
          console.log("pending state");
          setPending(true);
          break;
        case MOVE:
          const move = message.payload;
          console.log(move);

          chess.move(move);
          setBoard(chess.board());

          // ✅ Add this line to save opponent move
          //@ts-ignore
          setMoves((prev) => [...prev, { ...move, by: "opponent" }]);

          break;
      }
    };
  }, [socket, chess]);

  if (!socket)
    return (
      // <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      //   <div className="text-center">
      //     <div className="relative mb-8">
      //       <div className="w-16 h-16 mx-auto mb-4">
      //         <div className="absolute inset-0 rounded-full border-4 border-purple-200 opacity-25"></div>
      //         <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
      //       </div>
      //       <div className="flex justify-center space-x-1 mb-4">
      //         <div
      //           className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
      //           style={{ animationDelay: "0ms" }}
      //         ></div>
      //         <div
      //           className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
      //           style={{ animationDelay: "150ms" }}
      //         ></div>
      //         <div
      //           className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
      //           style={{ animationDelay: "300ms" }}
      //         ></div>
      //       </div>
      //     </div>
      //     <h2 className="text-2xl font-bold text-white mb-2">
      //       Connecting to Server
      //     </h2>
      //     <p className="text-purple-200 text-lg">
      //       Establishing secure connection...
      //     </p>
      //   </div>
      // </div>
      <>
        <h1>Loadinng</h1>
      </>
    );

  const handlePlay = () => {
    socket.send(
      JSON.stringify({
        type: INIT_GAME,
      })
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="flex flex-col xl:flex-row gap-4 sm:gap-6 md:gap-8 items-center xl:items-start">
          {/* Chess Board Section */}
          <div className="w-full xl:w-3/4 max-w-2xl xl:max-w-none">
            <div className="bg-gray-800 rounded-lg sm:rounded-xl shadow-lg sm:shadow-2xl overflow-hidden border border-gray-700">
              <ChessBoard
                chess={chess}
                setBoard={setBoard}
                board={board}
                socket={socket}
                color={color}
                setMoves={setMoves} // ✅ pass it here
              />
            </div>
          </div>
          {/* Game Controls Section */}
          <div className="w-full xl:w-1/4 max-w-md xl:max-w-none">
            <div className="bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg sm:shadow-2xl border border-gray-700">
              <h3 className="text-base sm:text-lg font-semibold  text-gray-300 text-center">
                Move History
              </h3>
              <hr className=" mb-3" />
              <div className="max-h-72 overflow-y-auto space-y-2">
                {moves.map((move: Move, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between px-3 py-2 rounded-md text-sm shadow ${
                      move.by === "me"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-600 text-white"
                    }`}
                  >
                    <span className="font-semibold">
                      {move.by === "me" ? "You" : "Opponent"}
                    </span>
                    <span className="font-mono">
                      {move.from} → {move.to}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full xl:w-1/4 max-w-md xl:max-w-none">
            <div className="bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg sm:shadow-2xl border border-gray-700">
              {!started && (
                <button
                  onClick={handlePlay}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 sm:py-3 px-3 sm:px-4 rounded-md sm:rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md sm:shadow-lg"
                >
                  {pending ? "Searchning for another payer" : "Start New Game"}
                </button>
              )}
              <div className="mt-4 sm:mt-6">
                <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-300">
                  Game Status
                </h3>

                <div className="bg-gray-700 rounded-md sm:rounded-lg p-3 sm:p-4 text-xs sm:text-sm text-gray-200">
                  {chess.isGameOver() ? (
                    <p className="text-red-400">Game Over</p>
                  ) : (
                    <p>{chess.turn() === "w" ? "White" : "Black"}'s turn</p>
                  )}
                </div>
              </div>
              <div className="mt-4 sm:mt-6">
                <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-300">
                  Your Color
                </h3>
                <div className="bg-gray-700 rounded-md sm:rounded-lg p-3 sm:p-4 text-xs sm:text-sm text-gray-200 capitalize">
                  {color || "Not assigned"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
