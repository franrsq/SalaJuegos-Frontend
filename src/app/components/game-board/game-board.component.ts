import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckersBoardStyle } from 'src/app/game/checkers/checkers-style';
import { Engine } from 'src/app/game/engine';
import { FirebaseService } from 'src/app/shared/services/firebase.service';
import { BoardManager } from '../../game/board-manager';
import { CheckersEngine } from "../../game/checkers/checkers-engine";
import { EndGameDialogComponent } from '../end-game-dialog/end-game-dialog.component';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit, OnDestroy {

  boardManager: BoardManager;

  constructor(
    public dialog: MatDialog,
    private router: Router,
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
    this.boardManager.getGameStatus().subscribe(status => {
      if (status == Engine.GAME_WON) {
        this.showEndGameDialog(true);
      } else if (status == Engine.GAME_LOST) {
        this.showEndGameDialog(false);
      }
    });
  }

  spaceClick(space) {
    this.boardManager.onClick(space.row, space.column);
  }

  showEndGameDialog(won: boolean) {
    const dialogRef = this.dialog.open(EndGameDialogComponent, {
      autoFocus: true,
      width: '200px'
    });
    dialogRef.componentInstance.won = won;
    dialogRef.afterClosed().subscribe(() => {
      this.router.navigateByUrl('/choose-game');
    });
  }

  ngOnDestroy(): void {
    this.boardManager.destroyGame();
  }
}
