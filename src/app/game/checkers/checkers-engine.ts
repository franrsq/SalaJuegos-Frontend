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
        board.board[3][5].piece = new BlackPiece(); // mae croki playo esto lo pusimos nosotros para probar cosas, si quiere se lo hecha :)
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
        let spaces = this.posibleJugada(row, column);
        this.board.removeHighlight();
        if (spaces != []) {
            this.board.highlight(spaces);
        }
    }

    posiblesEspaciosNegros(row, colum): Space[] {
        let spaces: Space[] = [];
        if (this.board.board[row][colum].piece != null) {
            if (colum != (this.board.board[0].length - 1)) {
                if (this.board.board[row + 1][colum + 1].piece == null) { //Si en el lugar a mover no hay una pieza
                    spaces = [this.board.board[row + 1][colum + 1]]; // entonces es un espacio disponible
                } else if (this.board.board[row + 1][colum + 1].piece.getPieceImg().includes("black")) { //si en el lugar a mover hay una pieza negra
                    console.log("no se puede jugar hay un aliado derecha") // no se puede jugar ahi
                } else {
                    console.log("es enemigo") //aqui va a ir la logica de si es un enemigo
                }
            }
            if (colum != 0) {
                if (this.board.board[row + 1][colum - 1].piece == null) {
                    spaces.push(this.board.board[row + 1][colum - 1]); // entonces es un espacio disponible
                } else if (this.board.board[row + 1][colum - 1].piece.getPieceImg().includes("black")) {
                    console.log("no se puede jugar hay un aliado izquierda")
                } else {
                    console.log("es enemigo") //aqui va a ir la logica de si es un enemigo
                }
            }
        }
        return spaces;
    }

    posiblesEspaciosRojos(row, colum): Space[] {
        let spaces: Space[] = [];
        if (this.board.board[row][colum].piece != null) {
            if (colum != (this.board.board[0].length - 1)) {
                if (this.board.board[row - 1][colum + 1].piece == null) { //Si en el lugar a mover no hay una pieza
                    spaces = [this.board.board[row - 1][colum + 1]]; // entonces es un espacio disponible
                } else if (this.board.board[row - 1][colum + 1].piece.getPieceImg().includes("red")) { //si en el lugar a mover hay una pieza negra
                    console.log("no se puede jugar hay un aliado derecha") // no se puede jugar ahi
                } else {
                    console.log("es enemigo") //aqui va a ir la logica de si es un enemigo
                }
            }
            if (colum != 0) {
                if (this.board.board[row - 1][colum - 1].piece == null) {
                    spaces.push(this.board.board[row - 1][colum - 1]); // entonces es un espacio disponible
                } else if (this.board.board[row - 1][colum - 1].piece.getPieceImg().includes("red")) {
                    console.log("no se puede jugar hay un aliado izquierda")
                } else {
                    console.log("es enemigo") //aqui va a ir la logica de si es un enemigo
                }
            }
        }
        return spaces;
    }

    posibleJugada(row, colum): Space[]{
        let spaces: Space[] = [];
        if(this.board.board[row][colum].piece != null){
            if(this.board.board[row][colum].piece.getPieceImg().includes("red")){
                spaces = this.posiblesEspaciosRojos(row,colum);
            }else{
                spaces = this.posiblesEspaciosNegros(row,colum);
            }
        }
        return spaces;
    }
}