import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { GAME_OVER, INIT_GAME, MOVE, GAME_STATUS } from "./messages";
export class Game {
  public player1: WebSocket;
  public player2: WebSocket;
  private board: Chess;
  private startTime: Date;
  private moveCount = 0;
  constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.startTime = new Date();
    this.player1.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "white",
        },
      })
    );
    this.player2.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "black",
        },
      })
    );
  }
  makeMove(socket: WebSocket, move: { from: string; to: string; promotion?: "q" | "r" | "b" | "n" }) {
    try {
      this.board.move(move);
    } catch (e) {
      return;
    }
    if (this.board.isGameOver()) {
      this.player1.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: this.board.turn() === "w" ? "black" : "white",
          },
        })
      );
      this.player2.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: this.board.turn() === "w" ? "black" : "white",
          },
        })
      );
      return;
    }
    if (this.moveCount % 2 === 0) {
      this.player2.send(
        JSON.stringify({
          type: MOVE,
          payload: move,
        })
      );
    } else {
      this.player1.send(
        JSON.stringify({
          type: MOVE,
          payload: move,
        })
      );
    }

    // Send game status to opponent (check/checkmate/stalemate)
    const opponent = this.moveCount % 2 === 0 ? this.player2 : this.player1;
    opponent.send(
      JSON.stringify({
        type: GAME_STATUS,
        payload: {
          isCheck: this.board.isCheck(),
          isCheckmate: this.board.isCheckmate(),
          isStalemate: this.board.isStalemate(),
        },
      })
    );

    this.moveCount++;
  }
}
