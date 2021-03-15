import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-nickname-dialog',
  templateUrl: './nickname-dialog.component.html',
  styleUrls: ['./nickname-dialog.component.css']
})
export class NicknameDialogComponent implements OnInit {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<NicknameDialogComponent>) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nickname: ['', Validators.required]
    });
  }

  save() {
    this.dialogRef.close(this.form.value);
  }

}
