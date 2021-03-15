import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BoardSizeDialogComponent } from '../board-size-dialog/board-size-dialog.component';
import { NicknameDialogComponent } from '../nickname-dialog/nickname-dialog.component';

@Component({
  selector: 'app-choose-game',
  templateUrl: './choose-game.component.html',
  styleUrls: ['./choose-game.component.css']
})
export class ChooseGameComponent implements OnInit {

  size: string;

  constructor(public dialog: MatDialog, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    const data = JSON.parse(localStorage.getItem('nickname'));
    if (!data.nickname) {
      this.nickNameDialog();
    }
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

  nickNameDialog() {
    this.dialog.open(NicknameDialogComponent, {
      disableClose: true,
      autoFocus: true
    }).afterClosed().subscribe(result => {
      this.authService.saveNickname(result.nickname);
    });
  }
}
