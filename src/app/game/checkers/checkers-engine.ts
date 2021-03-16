import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators"
import { FirebaseService } from "src/app/shared/services/firebase.service";
import { BoardManager } from "../board-manager";
import { Engine } from "../engine"
import { Space } from "../space";
import { BlackPiece } from "./black-piece";
import { RedPiece } from "./red-piece";

export class CheckersEngine extends Engine {
    private unsubscribe = new Subject<void>();
    aiType;
    boardManager: BoardManager;
    selectedSpace: Space = null;
    possiblePlays: Space[] = [];

    constructor(firebaseService: FirebaseService, aiType = null) {
        super(firebaseService);
        this.aiType = aiType;
    }

    initGame(boardManager: BoardManager) {
        this.boardManager = boardManager;
        this.firebaseService.sendCommand('checkers', {
            command: 'play_ai',
            height: 8,
            width: 8,
            aiType: this.aiType
        });
        if (this.aiType) {
            this.firebaseService.observePlayerStates()
                .pipe(takeUntil(this.unsubscribe))
                .subscribe((res: any) => {
                    if (res) {
                        this.firebaseService.observeGame(res.gamePath, res.game)
                            .pipe(takeUntil(this.unsubscribe))
                            .subscribe((res: any) => {
                                if (res) {
                                    this.loadGameMatrix(res.gameMatrix);
                                }
                            });
                    }
                });
        }
    }

    private loadGameMatrix(matrix: [][]) {
        let i = 0;
        for (let row in matrix) {
            let j = 0;
            for (let value of matrix[row]) {
                if (value == 0 || value == 1) {
                    this.boardManager.board[i][j].piece = new BlackPiece(value);
                } else if (value == 2 || value == 3) {
                    this.boardManager.board[i][j].piece = new RedPiece(value);
                } else {
                    this.boardManager.board[i][j].piece = null;
                }
                j++;
            }
            i++;
        }
    }

    click(row, column) {
        this.boardManager.removeHighlight();
        // If is the first select, highlight all possible positions or if the user selects
        // another piece that is not highlighted recalculate the highlight
        if (!this.selectedSpace || (!this.possiblePlays.includes(this.boardManager.board[row][column])
            && this.boardManager.board[row][column].piece)) {
            this.calculatePossiblePlays(row, column);
            this.boardManager.removeHighlight();
            if (this.possiblePlays != []) {
                this.boardManager.highlight(this.possiblePlays);
                this.selectedSpace = this.boardManager.board[row][column];
            }
        } else if (this.possiblePlays.includes(this.boardManager.board[row][column])) {
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

        this.boardManager.board[row][column].piece =
            this.boardManager.board[selectedRow][selectedColumn].piece;
        this.boardManager.board[selectedRow][selectedColumn].piece = null;

        // Jumped over a piece
        if (Math.abs(this.selectedSpace.row - row) == 2) {
            console.log(0)
            if (selectedRow - row == -2 && selectedColumn - column == 2) { // izq abajo
                this.boardManager.board[selectedRow + 1][selectedColumn - 1].piece = null;
            } else if (selectedRow - row == -2 && selectedColumn - column == -2) { // der abajo
                this.boardManager.board[selectedRow + 1][selectedColumn + 1].piece = null;
            } else if (selectedRow - row == 2 && selectedColumn - column == 2) { // izq arriba
                this.boardManager.board[selectedRow - 1][selectedColumn - 1].piece = null;
            } else if (selectedRow - row == 2 && selectedColumn - column == -2) { // der arriba
                this.boardManager.board[selectedRow - 1][selectedColumn + 1].piece = null;
            }
        }

        this.clearSelection();
    }

    possibleBlackSpaces(row, column): Space[] {
        let spaces: Space[] = [];
        if (this.boardManager.board[row][column].piece != null) {
            if (column != (this.boardManager.board[0].length - 1)) {
                if (this.boardManager.board[row + 1][column + 1].piece == null) { //Si en el lugar a mover no hay una pieza
                    spaces = [this.boardManager.board[row + 1][column + 1]]; // entonces es un espacio disponible
                } else if (this.boardManager.board[row + 1][column + 1].piece.getPieceImg().includes("black")) { //si en el lugar a mover hay una pieza negra
                    console.log("no se puede jugar hay un aliado derecha") // no se puede jugar ahi
                } else if (!this.boardManager.board[row + 2][column + 2].piece) { // Enemigo y se puede comer
                    console.log("es enemigo y se puede comer") //aqui va a ir la logica de si es un enemigo
                    spaces.push(this.boardManager.board[row + 2][column + 2]);
                }
            }
            if (column != 0) {
                if (this.boardManager.board[row + 1][column - 1].piece == null) {
                    spaces.push(this.boardManager.board[row + 1][column - 1]); // entonces es un espacio disponible
                } else if (this.boardManager.board[row + 1][column - 1].piece.getPieceImg().includes("black")) {
                    console.log("no se puede jugar hay un aliado izquierda")
                } else if (!this.boardManager.board[row + 2][column - 2].piece) {
                    console.log("es enemigo y se puede comer") //aqui va a ir la logica de si es un enemigo
                    spaces.push(this.boardManager.board[row + 2][column - 2]);
                }
            }
        }
        return spaces;
    }

    possibleRedSpaces(row, column): Space[] {
        let spaces: Space[] = [];
        if (this.boardManager.board[row][column].piece != null) {
            if (column != (this.boardManager.board[0].length - 1)) {
                if (this.boardManager.board[row - 1][column + 1].piece == null) { //Si en el lugar a mover no hay una pieza
                    spaces = [this.boardManager.board[row - 1][column + 1]]; // entonces es un espacio disponible
                } else if (this.boardManager.board[row - 1][column + 1].piece.getPieceImg().includes("red")) { //si en el lugar a mover hay una pieza negra
                    console.log("no se puede jugar hay un aliado derecha") // no se puede jugar ahi
                } else if (!this.boardManager.board[row - 2][column + 2].piece) {
                    console.log("es enemigo y se puede comer") //aqui va a ir la logica de si es un enemigo
                    spaces.push(this.boardManager.board[row - 2][column + 2]);
                }
            }
            if (column != 0) {
                if (this.boardManager.board[row - 1][column - 1].piece == null) {
                    spaces.push(this.boardManager.board[row - 1][column - 1]); // entonces es un espacio disponible
                } else if (this.boardManager.board[row - 1][column - 1].piece.getPieceImg().includes("red")) {
                    console.log("no se puede jugar hay un aliado izquierda")
                } else if (!this.boardManager.board[row - 2][column - 2].piece) {
                    console.log("es enemigo y se puede comer") //aqui va a ir la logica de si es un enemigo
                    spaces.push(this.boardManager.board[row - 2][column - 2]);
                }
            }
        }
        return spaces;
    }

    calculatePossiblePlays(row, column) {
        if (this.boardManager.board[row][column].piece != null) {
            if (this.boardManager.board[row][column].piece.getPieceImg().includes("red")) {
                this.possiblePlays = this.possibleRedSpaces(row, column);
            } else {
                this.possiblePlays = this.possibleBlackSpaces(row, column);
            }
        }
    }

    destroyGame() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}