import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CheckersBoardStyle } from 'src/app/game/checkers/checkers-style';
import { CheckersService } from 'src/app/shared/services/checkers/checkers.service';
import { FirebaseService } from 'src/app/shared/services/firebase.service';
import { BoardManager } from '../../game/board-manager';
import { CheckersEngine } from "../../game/checkers/checkers-engine";

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit, OnDestroy {

  boardManager: BoardManager;

  constructor(
    private _checkersService: CheckersService,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const aiType = this.route.snapshot.paramMap.get('aiType');
    this.boardManager = new BoardManager(this._checkersService.boardSize, this._checkersService.boardSize,
      new CheckersBoardStyle(), new CheckersEngine(this.firebaseService, aiType));
  }

  spaceClick(space) {
    this.boardManager.onClick(space.row, space.column);
  }

  ngOnDestroy(): void {
    this.boardManager.destroyGame();
  }
}
