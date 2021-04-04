import { Observable } from "rxjs";
import { FirebaseService } from "../shared/services/firebase.service";
import { BoardManager } from "./board-manager";

export abstract class Engine {

    static readonly GAME_IN_PLAY = 0;
    static readonly GAME_LOST = 1;
    static readonly GAME_WON = 2;

    firebaseService: FirebaseService;

    constructor(firebaseService: FirebaseService, aiType = null, wantsToStart = null) {
        this.firebaseService = firebaseService;
    }

    abstract initGame(boardManager: BoardManager);

    abstract click(row: Number, column: Number);

    abstract isLoading(): Observable<boolean>;

    abstract getGameStatus(): Observable<number>;

    abstract destroyGame();
}