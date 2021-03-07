import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CheckersService } from 'src/app/shared/services/checkers/checkers.service';

@Component({
  selector: 'app-board-size-dialog',
  templateUrl: './board-size-dialog.component.html',
  styleUrls: ['./board-size-dialog.component.css']
})
export class BoardSizeDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<BoardSizeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private _checkersService: CheckersService,) { }

  validateSize(size: string) {
    if (size != undefined) {
      var intSize = Number(size);
      if (intSize > 3) {
        if ((intSize % 2) == 0) {
          this._checkersService.boardSize = intSize;
          this.dialogRef.close();
        } else {
          console.log("Tiene que ser un número par")
        }
      } else {
        console.log("Tiene que ser mayor a 3")
      }
    }else{
      console.log("Debe ingresar un número")
    }
  }
}

export interface DialogData {
  size: string;
}