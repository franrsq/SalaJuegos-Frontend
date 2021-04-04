import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-checkers-dialog',
  templateUrl: './new-checkers-dialog.component.html',
  styleUrls: ['./new-checkers-dialog.component.css']
})
export class NewCheckersDialogComponent {
  form: FormGroup;
  player = 1; // 1 play first, 2 play second
  level = 1; // 1 eassy, 2 medium, 3 hard
  multiplayer: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<NewCheckersDialogComponent>) { }

  ngOnInit(): void {
    if (this.multiplayer) {
      this.form = this.formBuilder.group({
        boardSize: ['', [Validators.required, Validators.min(6),
        Validators.max(14), Validators.pattern("^\\d*[02468]$")]],
        wantsToStart: ['', Validators.required]
      });
    } else {
      this.form = this.formBuilder.group({
        boardSize: ['', Validators.required],
        wantsToStart: ['', Validators.required],
        difficulty: ['', Validators.required]
      });
    }
  }

  play() {
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }
}