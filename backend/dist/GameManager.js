"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const messages_1 = require("./messages");
const Game_1 = require("./Game");
let userCount = 0;
class GameManager {
    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }
    addUser(socket) {
        console.log("No. of Users", userCount);
        userCount = userCount + 1;
        this.users.push(socket);
        this.addHandler(socket);
    }
    removeUser(socket) {
        this.users = this.users.filter((user) => user !== socket);
    }
    addHandler(socket) {
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());
            if (message.type === messages_1.INIT_GAME) {
                if (this.pendingUser) {
                    console.log("Both users connected");
                    const game = new Game_1.Game(this.pendingUser, socket);
                    this.games.push(game);
                    this.pendingUser = null;
                }
                else {
                    console.log("pending state");
                    this.pendingUser = socket;
                }
            }
            if (message.type === messages_1.MOVE) {
                console.log("one person moves" + JSON.stringify(message.payload.move));
                const game = this.games.find((game) => game.player1 === socket || game.player2 === socket);
                if (game) {
                    game.makeMove(socket, message.payload.move);
                }
            }
        });
    }
}
exports.GameManager = GameManager;
