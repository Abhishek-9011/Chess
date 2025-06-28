import type { Color, PieceSymbol, Square } from "chess.js";
import  { useState } from "react";
import { MOVE } from "../config/messages";

const ChessBoard = ({
  chess,
  board,
  socket,
  setBoard,
}: {
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket;
  setBoard: any;
  chess: any;
}) => {
  const [from, setFrom] = useState<null | Square>();
  const [to, setTo] = useState<null | Square>();
  return (
    <div className="text-white-200">  
      {board.map((row, i) => {
        return (
          <div key={i} className="flex">
            {row.map((square, j) => { 
              const squareRepresetation = (String.fromCharCode(97 + (j % 8)) +
                "" +
                (8 - i)) as Square;
              return (
                <div
                  onClick={() => {
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
                      setFrom(null);
                      chess.move({
                        from,
                        to: squareRepresetation,
                      });
                      setBoard(chess.board());
                    }
                  }
                }
                  key={j}
                  className={`w-23 h-20 ${ 
                    (i + j) % 2 === 0 ? " bg-green-500" : "bg-white"
                  } `}
                >
                  <div className=" w-full justify-center flex h-full">
                    {" "}
                    <div className="text-black h-full justify-center flex flex-col">
                      {square ? square.type : ""}
                    </div>
                  </div>
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
