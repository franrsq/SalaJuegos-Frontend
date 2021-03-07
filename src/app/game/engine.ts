import { Board } from "./board";

export abstract class Engine {
    abstract initGame(board: Board);

    abstract click(row: Number, column: Number);
}