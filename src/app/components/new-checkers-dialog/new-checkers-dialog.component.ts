import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CheckersService } from 'src/app/shared/services/checkers/checkers.service';

@Component({
  selector: 'app-new-checkers-dialog',
  templateUrl: './new-checkers-dialog.component.html',
  styleUrls: ['./new-checkers-dialog.component.css']
})
export class NewCheckersDialogComponent {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<NewCheckersDialogComponent>,
    private _checkersService: CheckersService) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      boardSize: ['', Validators.required]
    });
  }

  play() {
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }
}