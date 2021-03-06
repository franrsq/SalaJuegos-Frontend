import { Component, OnInit } from '@angular/core';
import { CheckersBoardStyle } from 'src/app/game/checkers/checkers-style';
import { Space } from 'src/app/game/space';
import { Board } from '../../game/board';
import { CheckersEngine } from "../../game/checkers/checkers-engine"

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit {

  board = new Board(8, 8, new CheckersBoardStyle(), new CheckersEngine());

  constructor() { }

  ngOnInit(): void {
    console.log("segundo "+ this.board.board[0][0].piece.getPieceImg());
  }

}
