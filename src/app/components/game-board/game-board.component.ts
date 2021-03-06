import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CheckersBoardStyle } from 'src/app/game/checkers/checkers-style';
import { Board } from '../../game/board';
import { CheckersEngine } from "../../game/checkers/checkers-engine"
import { BoardSizeDialogComponent } from '../board-size-dialog/board-size-dialog.component';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit {

  size: string;
  board = new Board(8, 8, new CheckersBoardStyle(), new CheckersEngine());

  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    console.log("segundo " + this.board.board[0][0].piece.getPieceImg());
    //this.openDialog();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(BoardSizeDialogComponent, {
      disableClose: true,
      width: '35%',
      height: '45%',
      data: { size: this.size }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result != undefined) {
        this.size = result; //llama al otro dialog
      }
    });
  }
}
