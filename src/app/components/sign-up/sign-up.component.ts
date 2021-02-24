import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth-service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    public authService: AuthService,
    private router: Router, 
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    // Valida los campos requeridos
    this.loginForm = this.formBuilder.group({
      user: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login(){

  }
}
