import { Board } from "../board";
import { Engine } from "../engine"
import { Space } from "../space";
import { BlackPiece } from "./black-piece";
import { RedPiece } from "./red-piece";

export class CheckersEngine extends Engine {
    board: Board;
    selectedSpace: Space = null;
    possiblePlays: Space[];

    initGame(board: Board) {
        let element: Space;
        this.board = board;

        for (let i = 0; i < board.board.length; i++) {
            for (let j = 0; j < board.board[i].length; j++) {
                element = board.board[i][j]; // fila columna 
                if (element.styleImage.includes("blue") && i < (board.board.length / 2) - 1) {
                    element.piece = new BlackPiece();
                }
                if (element.styleImage.includes("blue") && i > (board.board.length / 2)) {
                    element.piece = new RedPiece();
                }
            }
        }
    }

    click(row, column) {
        this.board.removeHighlight();
        // If is the first select, highlight all possible positions or if the user selects
        // another piece that is not highlighted recalculate the highlight
        if (!this.selectedSpace || (!this.possiblePlays.includes(this.board.board[row][column])
            && this.board.board[row][column].piece)) {
            this.calculatePossiblePlays(row, column);
            this.board.removeHighlight();
            if (this.possiblePlays != []) {
                this.board.highlight(this.possiblePlays);
                this.selectedSpace = this.board.board[row][column];
            }
        } else if (this.possiblePlays.includes(this.board.board[row][column])) {
            this.moveSelectedPiece(row, column);
        } else {
            this.clearSelection();
        }
    }

    clearSelection() {
        this.possiblePlays = [];
        this.selectedSpace = null;
    }

    moveSelectedPiece(row, column) {
        let selectedRow = this.selectedSpace.row;
        let selectedColumn = this.selectedSpace.column;

        this.board.board[row][column].piece =
            this.board.board[selectedRow][selectedColumn].piece;
        this.board.board[selectedRow][selectedColumn].piece = null;

        // Jumped over a piece
        if (Math.abs(this.selectedSpace.row - row) == 2) {
            console.log(0)
            if (selectedRow - row == -2 && selectedColumn - column == 2) { // izq abajo
                console.log(1)
                this.board.board[selectedRow + 1][selectedColumn - 1].piece = null;
            } else if (selectedRow - row == -2 && selectedColumn - column == -2) { // der abajo
                console.log(2)
                this.board.board[selectedRow + 1][selectedColumn + 1].piece = null;
            } else if (selectedRow - row == 2 && selectedColumn - column == 2) { // izq arriba
                console.log(3)
                this.board.board[selectedRow - 1][selectedColumn - 1].piece = null;
            } else if (selectedRow - row == 2 && selectedColumn - column == -2) { // der arriba
                console.log(4)
                this.board.board[selectedRow - 1][selectedColumn + 1].piece = null;
            }
        }

        this.clearSelection();
    }

    possibleBlackSpaces(row, column): Space[] {
        let spaces: Space[] = [];
        if (this.board.board[row][column].piece != null) {
            if (column != (this.board.board[0].length - 1)) {
                if (this.board.board[row + 1][column + 1].piece == null) { //Si en el lugar a mover no hay una pieza
                    spaces = [this.board.board[row + 1][column + 1]]; // entonces es un espacio disponible
                } else if (this.board.board[row + 1][column + 1].piece.getPieceImg().includes("black")) { //si en el lugar a mover hay una pieza negra
                    console.log("no se puede jugar hay un aliado derecha") // no se puede jugar ahi
                } else if (!this.board.board[row + 2][column + 2].piece) { // Enemigo y se puede comer
                    console.log("es enemigo y se puede comer") //aqui va a ir la logica de si es un enemigo
                    spaces.push(this.board.board[row + 2][column + 2]);
                }
            }
            if (column != 0) {
                if (this.board.board[row + 1][column - 1].piece == null) {
                    spaces.push(this.board.board[row + 1][column - 1]); // entonces es un espacio disponible
                } else if (this.board.board[row + 1][column - 1].piece.getPieceImg().includes("black")) {
                    console.log("no se puede jugar hay un aliado izquierda")
                } else if (!this.board.board[row + 2][column - 2].piece) {
                    console.log("es enemigo y se puede comer") //aqui va a ir la logica de si es un enemigo
                    spaces.push(this.board.board[row + 2][column - 2]);
                }
            }
        }
        return spaces;
    }

    possibleRedSpaces(row, column): Space[] {
        let spaces: Space[] = [];
        if (this.board.board[row][column].piece != null) {
            if (column != (this.board.board[0].length - 1)) {
                if (this.board.board[row - 1][column + 1].piece == null) { //Si en el lugar a mover no hay una pieza
                    spaces = [this.board.board[row - 1][column + 1]]; // entonces es un espacio disponible
                } else if (this.board.board[row - 1][column + 1].piece.getPieceImg().includes("red")) { //si en el lugar a mover hay una pieza negra
                    console.log("no se puede jugar hay un aliado derecha") // no se puede jugar ahi
                } else if (!this.board.board[row - 2][column + 2].piece) {
                    console.log("es enemigo y se puede comer") //aqui va a ir la logica de si es un enemigo
                    spaces.push(this.board.board[row - 2][column + 2]);
                }
            }
            if (column != 0) {
                if (this.board.board[row - 1][column - 1].piece == null) {
                    spaces.push(this.board.board[row - 1][column - 1]); // entonces es un espacio disponible
                } else if (this.board.board[row - 1][column - 1].piece.getPieceImg().includes("red")) {
                    console.log("no se puede jugar hay un aliado izquierda")
                } else if (!this.board.board[row - 2][column - 2].piece) {
                    console.log("es enemigo y se puede comer") //aqui va a ir la logica de si es un enemigo
                    spaces.push(this.board.board[row - 2][column - 2]);
                }
            }
        }
        return spaces;
    }

    calculatePossiblePlays(row, column) {
        if (this.board.board[row][column].piece != null) {
            if (this.board.board[row][column].piece.getPieceImg().includes("red")) {
                this.possiblePlays = this.possibleRedSpaces(row, column);
            } else {
                this.possiblePlays = this.possibleBlackSpaces(row, column);
            }
        }
    }
}