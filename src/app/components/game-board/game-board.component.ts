import { Component, OnInit } from '@angular/core';
import { CheckersBoardStyle } from 'src/app/game/checkers/checkers-style';
import { Board } from '../../game/board';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit {

  board = new Board(8, 8, new CheckersBoardStyle());

  constructor() { }

  ngOnInit(): void {
  }

}
