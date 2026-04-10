import type { Color, PieceSymbol, Square } from "chess.js";
import { useState, useEffect } from "react";
import { MOVE } from "../config/messages";
import PromotionDialog from "./PromotionDialog";

const ChessBoard = ({
  chess,
  board,
  socket,
  setBoard,
  color,
  setMoves, // ✅ Accept this prop
}: {
  board: (
    | {
        square: Square;
        type: PieceSymbol;
        color: Color;
      }
    | null
  )[][];
  socket: WebSocket;
  setBoard: any;
  chess: any;
  color: any;
  setMoves:any;
}) => {
  const [from, setFrom] = useState<null | Square>(null);
  const [validMoves, setValidMoves] = useState<Square[]>([]);
  const [isPromotionOpen, setIsPromotionOpen] = useState(false);
  const [pendingMove, setPendingMove] = useState<{ from: Square; to: Square } | null>(null);

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

  const completeMove = (move: { from: Square; to: Square }, promotion?: "q" | "r" | "b" | "n") => {
    try {
      // Try to make the move with or without promotion
      const moveData = promotion ? { ...move, promotion } : move;
      chess.move(moveData);

      // Send move to server (with promotion if applicable)
      socket.send(
        JSON.stringify({
          type: MOVE,
          payload: { move: moveData },
        })
      );

      // Update board display
      setBoard(chess.board());

      // Track move
      setMoves((prev: any) => [...prev, { ...moveData, by: "me" }]);
      
      // Clear selection
      setFrom(null);
    } catch (e) {
      console.error("Invalid move:", e);
      setFrom(null);
    }
  };

  const isPromotionMove = (fromSq: Square, toSq: Square): boolean => {
    // Check if moving a pawn to promotion rank
    const piece = chess.get(fromSq);
    if (!piece || piece.type !== "p") return false;
    
    const toRank = parseInt(toSq[1]);
    return (piece.color === "w" && toRank === 8) || (piece.color === "b" && toRank === 1);
  };

  // Flip board if player is black
  const displayBoard = color === "black" ? 
    [...board].reverse().map(row => [...row].reverse()) : 
    board;

  return (
    <div>
      <PromotionDialog
        isOpen={isPromotionOpen}
        onSelect={(piece) => {
          setIsPromotionOpen(false);
          if (pendingMove) {
            completeMove(pendingMove, piece);
            setPendingMove(null);
          }
        }}
      />
      {displayBoard.map((row, i) => {
        return (
          <div key={i} className="flex">
            {row.map((square, j) => {
              // Calculate actual square coordinates based on board orientation
              const fileIndex = color === "black" ? 7 - j : j;
              const rankIndex = color === "black" ? 7 - i : i;
              const squareRepresentation = (String.fromCharCode(97 + fileIndex) +
                (8 - rankIndex)) as Square;

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
                        const move = {
                          from,
                          to: squareRepresentation,
                        };

                        // Check if this is a pawn promotion
                        if (isPromotionMove(from, squareRepresentation)) {
                          setPendingMove(move);
                          setIsPromotionOpen(true);
                        } else {
                          completeMove(move);
                        }
                      }
                      setFrom(null);
                    }
                  }}
                  key={j}
                  className={`w-20 h-20 text-3xl flex items-center justify-center cursor-pointer relative ${
                    (i + j) % 2 === 0 ? "bg-green-500" : "bg-green-200"
                  } ${isSelected ? "border-4 border-blue-500" : ""}`}
                >
                  {square ? (
                    <img
                      className="w-10"
                      src={`/${
                        square?.color === "b"
                          ? square?.type
                          : `${square?.type?.toUpperCase()}_`
                      }.png`}
                      alt=""
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
