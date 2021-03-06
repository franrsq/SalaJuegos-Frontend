import { Engine } from "../engine"
import { Space } from "../space";
import { BlackPiece } from "./black-piece";
import { RedPiece } from "./red-piece";

export class CheckersEngine extends Engine {
    element: Space
    initGame(board: Space[][]) {
        console.log(board)
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                this.element = board[j][i]; // fila columna 
                if (this.element.styleImage.includes("blue") && i < (board.length / 2) - 1) {
                    this.element.piece = new BlackPiece();
                    board[j][i] = this.element;
                    console.log("cordenadas negras " + i, j);
                }
                if (this.element.styleImage.includes("blue") && i > (board.length / 2)) {
                    this.element.piece = new RedPiece();
                    board[j][i] = this.element;
                    console.log("cordenadas rojas " + i, j);
                }
            }
        }
    }
}