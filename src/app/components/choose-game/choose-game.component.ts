import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BoardSizeDialogComponent } from '../board-size-dialog/board-size-dialog.component';

@Component({
  selector: 'app-choose-game',
  templateUrl: './choose-game.component.html',
  styleUrls: ['./choose-game.component.css']
})
export class ChooseGameComponent implements OnInit {

  size: string;

  constructor(public dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {
  }

  openDialog(multiplayer: Boolean): void {
    const dialogRef = this.dialog.open(BoardSizeDialogComponent, {
      disableClose: true,
      width: '35%',
      height: '45%',
      data: { size: this.size }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (multiplayer) {
        this.router.navigateByUrl('/game-board');
      } else {
        this.router.navigateByUrl('/game-board');
      }
    });
  }
}
