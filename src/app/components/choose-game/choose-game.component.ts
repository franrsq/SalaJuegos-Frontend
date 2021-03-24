import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NewCheckersDialogComponent } from '../new-checkers-dialog/new-checkers-dialog.component';
import { NicknameDialogComponent } from '../nickname-dialog/nickname-dialog.component';

@Component({
  selector: 'app-choose-game',
  templateUrl: './choose-game.component.html',
  styleUrls: ['./choose-game.component.css']
})
export class ChooseGameComponent implements OnInit {

  size: string;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const data = JSON.parse(localStorage.getItem('nickname'));
    if (!data) {
      this.nickNameDialog();
    }
  }

  openDialog(multiplayer: boolean): void {
    const dialogRef = this.dialog.open(NewCheckersDialogComponent, {
      autoFocus: true,
      width: '250px'
    });
    dialogRef.componentInstance.multiplayer = multiplayer;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (multiplayer) {
          this.router.navigate(['/game-board', {
            rows: result.boardSize,
            cols: result.boardSize,
            wantsToStart: result.wantsToStart
          }]);
        } else {
          this.router.navigate(['/game-board', {
            rows: result.boardSize,
            cols: result.boardSize,
            aiType: result.difficulty,
            wantsToStart: result.wantsToStart
          }]);
        }
      }
    });
  }

  nickNameDialog() {
    this.dialog.open(NicknameDialogComponent, {
      disableClose: true,
      autoFocus: true
    }).afterClosed().subscribe(result => {
      if (result) {
        this.authService.saveNickname(result.nickname);
      }
    });
  }
}
