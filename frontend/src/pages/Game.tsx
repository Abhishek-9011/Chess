import ChessBoard from "../components/ChessBoard";
import { useSocket } from "../hooks/useSocket";
import { useEffect, useState } from "react";
import { Chess } from "chess.js";
import { INIT_GAME, MOVE } from "../config/messages";

const Game = () => {
  const socket = useSocket();
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());

  useEffect(() => {
    if (!socket) return;
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case INIT_GAME:
          setChess(new Chess());
          setBoard(chess.board());
          console.log("initialised");
          break;
        case MOVE:
          console.log(JSON.stringify(message.move));
          const move = message.payload;
          chess.move(move);
          setBoard(chess.board());
          console.log("move made");
          break;
      }
    };
  }, [socket]);

  if (!socket)
    return (
      <div className="flex items-center justify-center h-screen text-xl text-gray-600">
        Connecting to server...
      </div>
    );

  const handlePlay = () => {
    console.log("handle play called");
    socket.send(
      JSON.stringify({
        type: INIT_GAME,
      })
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="w-full lg:w-3/4">
            <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
              <ChessBoard
                chess={chess}
                setBoard={setBoard}
                board={board}
                socket={socket}
              />
            </div>
          </div>

          <div className="w-full lg:w-1/4">
            <div className="bg-gray-800 rounded-xl p-6 shadow-2xl border border-gray-700">
              <button
                onClick={handlePlay}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
              >
                Start New Game
              </button>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-300">
                  Game Status
                </h3>
                <div className="bg-gray-700 rounded-lg p-4 text-sm text-gray-200">
                  {chess.isGameOver() ? (
                    <p className="text-red-400">Game Over</p>
                  ) : (
                    <p>{chess.turn() === "w" ? "White" : "Black"}'s turn</p>
                  )}
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
