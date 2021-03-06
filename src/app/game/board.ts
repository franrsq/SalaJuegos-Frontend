import { BoardStyle } from "./board-style";
import { CheckersEngine } from "./checkers/checkers-engine"
import { Space } from "./space";

export class Board {
    board: Space[][];

    constructor(rows: number, columns: number, boardStyle: BoardStyle, checkersEngine: CheckersEngine) {
        this.board = boardStyle.generateBoard(rows, columns);
        this.board = checkersEngine.initGame(this.board);
    }
}