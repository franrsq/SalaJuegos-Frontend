import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CheckersBoardStyle } from 'src/app/game/checkers/checkers-style';
import { CheckersService } from 'src/app/shared/services/checkers/checkers.service';
import { Board } from '../../game/board';
import { CheckersEngine } from "../../game/checkers/checkers-engine"

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit {

  board: Board;

  constructor(
    private _checkersService: CheckersService,
  ) { }

  ngOnInit(): void {
    this.board = new Board(this._checkersService.boardSize, this._checkersService.boardSize, new CheckersBoardStyle(), new CheckersEngine());
    console.log("segundo " + this.board.board[0][0].piece.getPieceImg());
    //this.openDialog();
  }

  spaceClick(space) {
    this.board.onClick(space.row, space.column);
  }
}
