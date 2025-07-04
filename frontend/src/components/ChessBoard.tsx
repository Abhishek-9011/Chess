import type { Color, PieceSymbol, Square } from "chess.js";
import { useState, useEffect } from "react";
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
  const [from, setFrom] = useState<null | Square>(null);
  const [validMoves, setValidMoves] = useState<Square[]>([]);

  useEffect(() => {
    if (!from) {
      setValidMoves([]);
      return;
    }

    const moves = chess.moves({
      square: from,
      verbose: true,
    });

    const moveSquares = moves.map((move: any) => move.to);
    setValidMoves(moveSquares);
  }, [from, chess]);

  return (
    <div>
      {board.map((row, i) => {
        return (
          <div key={i} className="flex">
            {row.map((square, j) => {
              const squareRepresentation = (String.fromCharCode(97 + (j % 8)) +
                (8 - i)) as Square;

              const isValidMove = validMoves.includes(squareRepresentation);
              const isSelected = from === squareRepresentation;

              return (
                <div
                  onClick={() => {
                    if (chess.turn() !== (color === "white" ? "w" : "b")) {
                      return;
                    }
                    if (!from) {
                      if (square && square.color === (color === "white" ? "w" : "b")) {
                        setFrom(squareRepresentation);
                      }
                    } else {
                      if (isValidMove || squareRepresentation === from) {
                        socket.send(
                          JSON.stringify({
                            type: MOVE,
                            payload: {
                              move: {
                                from,
                                to: squareRepresentation,
                              },
                            },
                          })
                        );
                        chess.move({
                          from,
                          to: squareRepresentation,
                        });
                        setBoard(chess.board());
                      }
                      setFrom(null);
                    }
                  }}
                  key={j}
                  className={`w-20 h-20 text-3xl flex items-center justify-center cursor-pointer relative ${
                    (i + j) % 2 === 0 ? "bg-green-500" : "bg-green-200"
                  } ${
                    isSelected ? "border-4 border-blue-500" : ""
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
                  {isValidMove && !square && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-blue-500 opacity-50"></div>
                    </div>
                  )}
                  {isValidMove && square && (
                    <div className="absolute inset-0 bg-red-500 opacity-30"></div>
                  )}
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