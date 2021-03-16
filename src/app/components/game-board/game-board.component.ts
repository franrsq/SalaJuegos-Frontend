import { Component, OnInit } from '@angular/core';
import { CheckersBoardStyle } from 'src/app/game/checkers/checkers-style';
import { CheckersService } from 'src/app/shared/services/checkers/checkers.service';
import { FirestoreService } from 'src/app/shared/services/firestore.service';
import { BoardManager } from '../../game/board-manager';
import { CheckersEngine } from "../../game/checkers/checkers-engine";

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit {

  board: BoardManager;

  constructor(
    private _checkersService: CheckersService,
    private firestore: FirestoreService
  ) { }

  ngOnInit(): void {
    this.board = new BoardManager(this._checkersService.boardSize, this._checkersService.boardSize, 
      new CheckersBoardStyle(), new CheckersEngine(this.firestore, '123'));
    //this.openDialog();
  }

  spaceClick(space) {
    this.board.onClick(space.row, space.column);
  }
}
