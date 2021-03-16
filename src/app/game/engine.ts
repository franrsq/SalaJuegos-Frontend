import { BoardManager } from "./board-manager";

export abstract class Engine {

    abstract initGame(boardManager: BoardManager);

    abstract click(row: Number, column: Number);
}