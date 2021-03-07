import { Board } from "../board";
import { Engine } from "../engine"
import { Space } from "../space";
import { BlackPiece } from "./black-piece";
import { RedPiece } from "./red-piece";

export class CheckersEngine extends Engine {
    board: Board;
    element: Space

    initGame(board: Board) {
        this.board = board;

        for (let i = 0; i < board.board.length; i++) {
            for (let j = 0; j < board.board[i].length; j++) {
                this.element = board.board[i][j]; // fila columna 
                if (this.element.styleImage.includes("blue") && i < (board.board.length / 2) - 1) {
                    this.element.piece = new BlackPiece();
                    board.board[i][j] = this.element;
                }
                if (this.element.styleImage.includes("blue") && i > (board.board.length / 2)) {
                    this.element.piece = new RedPiece();
                    board.board[i][j] = this.element;
                }
            }
        }
    }

    click(row, column) {
        let spaces = [this.board.board[row][column]];
        this.board.removeHighlight();
        this.board.highlight(spaces);
    }
}