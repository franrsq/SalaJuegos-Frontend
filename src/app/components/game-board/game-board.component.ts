import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CheckersBoardStyle } from 'src/app/game/checkers/checkers-style';
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
    private firebaseService: FirebaseService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const strAiType = this.route.snapshot.paramMap.get('aiType');
    const aiType = strAiType ? parseInt(strAiType) : null;
    const rows = parseInt(this.route.snapshot.paramMap.get('rows'));
    const cols = parseInt(this.route.snapshot.paramMap.get('cols'));
    const wantsToStart = parseInt(this.route.snapshot.paramMap.get('wantsToStart'));
    this.boardManager = new BoardManager(rows, cols,
      new CheckersBoardStyle(), new CheckersEngine(this.firebaseService, aiType, wantsToStart));
  }

  spaceClick(space) {
    this.boardManager.onClick(space.row, space.column);
  }

  ngOnDestroy(): void {
    this.boardManager.destroyGame();
  }
}
