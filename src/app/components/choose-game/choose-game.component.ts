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

  constructor(public dialog: MatDialog, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    const data = JSON.parse(localStorage.getItem('nickname'));
    if (!data) {
      this.nickNameDialog();
    }
  }

  openDialog(multiplayer: Boolean): void {
    const dialogRef = this.dialog.open(NewCheckersDialogComponent, {
      autoFocus: true,
      width: '250px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.router.navigate(['/game-board', { aiType: 0 }]);
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
