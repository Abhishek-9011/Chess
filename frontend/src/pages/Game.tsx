import ChessBoard from "../components/ChessBoard";
import { useSocket } from "../hooks/useSocket";
import { useEffect, useState } from "react";
import { Chess } from "chess.js";
import { INIT_GAME, MOVE } from "../config/messages";

const Game = () => {
  const socket = useSocket();
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [started, setStarted] = useState(false);
  const [color, setColor] = useState("");

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
          break;
        case MOVE:
          const move = message.payload;
          chess.move(move);
          setBoard(chess.board());
          break;
      }
    };
  }, [socket, chess]);

  if (!socket)
    return (
      <div className="flex items-center justify-center h-screen text-xl text-gray-600">
        Connecting to server...
      </div>
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
              />
            </div>
          </div>

          {/* Game Controls Section */}
          <div className="w-full xl:w-1/4 max-w-md xl:max-w-none">
            <div className="bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg sm:shadow-2xl border border-gray-700">
              {!started && (
                <button
                  onClick={handlePlay}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 sm:py-3 px-3 sm:px-4 rounded-md sm:rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md sm:shadow-lg"
                >
                  Start New Game
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