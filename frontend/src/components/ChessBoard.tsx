import type { Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../config/messages";

const ChessBoard = ({
  chess,
  board,
  socket,
  setBoard,
  color,
}: {
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket;
  setBoard: any;
  chess: any;
  color: any;
}) => {
  const [from, setFrom] = useState<null | Square>();

  return (
    <div>
      {board.map((row, i) => {
        return (
          <div key={i} className="flex">
            {row.map((square, j) => {
              const squareRepresetation = (String.fromCharCode(97 + (j % 8)) +
                (8 - i)) as Square;

              return (
                <div
                  onClick={() => {
                    if (chess.turn() !== (color === "white" ? "w" : "b")) {
                      return;
                    }
                    if (!from) {
                      setFrom(squareRepresetation);
                    } else {
                      socket.send(
                        JSON.stringify({
                          type: MOVE,
                          payload: {
                            move: {
                              from,
                              to: squareRepresetation,
                            },
                          },
                        })
                      );
                      chess.move({
                        from,
                        to: squareRepresetation,
                      });
                      setBoard(chess.board());
                      setFrom(null);
                    }
                  }}
                  key={j}
                  className={`w-20 h-20 text-3xl flex items-center justify-center cursor-pointer ${
                    (i + j) % 2 === 0 ? "bg-green-500" : "bg-green-200"
                  }`}
                >
                  {square ? (
                    <img
                      className="w-10"
                      src={`/${
                        square?.color === "b"
                          ? square?.type
                          : `${square?.type?.toUpperCase() + "_"}`
                      }.png`}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default ChessBoard;
