import { BoardStyle } from "./board-style";

export class Board {
    board: any[][];

    constructor(rows: number, columns: number, boardStyle: BoardStyle) {
        this.board = boardStyle.generateBoard(rows, columns);
    }
}