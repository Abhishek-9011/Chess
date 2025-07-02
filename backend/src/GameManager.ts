import WebSocket from "ws";
import { INIT_GAME, MOVE, PENDING_STATE } from "./messages";
import { Game } from "./Game";
let userCount = 0;
export class GameManager {
  private games: Game[];
  private pendingUser: WebSocket | null;
  private users: WebSocket[];
  constructor() {
    this.games = [];
    this.pendingUser = null;
    this.users = [];
  }
  addUser(socket: WebSocket) {
    console.log("No. of Users", userCount);
    userCount = userCount + 1;
    this.users.push(socket);
    this.addHandler(socket);
  }
  removeUser(socket: WebSocket) {
    this.users = this.users.filter((user) => user !== socket);
  }
  private addHandler(socket: WebSocket) {
    socket.on("message", (data) => {
      const message = JSON.parse(data.toString());
      if (message.type === INIT_GAME) {
        if (this.pendingUser && this.pendingUser!=socket) {
          console.log("Both users connected");
          const game = new Game(this.pendingUser, socket);
          this.games.push(game);
          this.pendingUser = null;
        } else {
          console.log("pending state");

          this.pendingUser = socket;
        }
      }
      if (message.type === MOVE) {
        console.log("one person moves"+JSON.stringify(message.payload.move));
        
        const game = this.games.find(
          (game) => game.player1 === socket || game.player2 === socket
        );
        if (game) {
          game.makeMove(socket, message.payload.move);
        }
      }
    });
  }
}
