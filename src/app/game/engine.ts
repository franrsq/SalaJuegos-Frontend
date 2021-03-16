import { FirebaseService } from "../shared/services/firebase.service";
import { BoardManager } from "./board-manager";

export abstract class Engine {

    firebaseService: FirebaseService;

    constructor(firebaseService: FirebaseService, aiType = null) {
        this.firebaseService = firebaseService;
    }

    abstract initGame(boardManager: BoardManager);

    abstract click(row: Number, column: Number);

    abstract destroyGame();
}