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

  form: FormGroup;

  constructor(
    public authService: AuthService,
    private router: Router, 
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    // Valida los campos requeridos
    this.form = this.formBuilder.group({
      nickname: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  register(){
    console.log("hola")
    console.log(this.form.value.nickname, this.form.value.email, this.form.value.password, this.form.value.confirmPassword);
    if(this.form.value.password === this.form.value.confirmPassword){

    }
    
    this.authService.SignUp(this.form.value.nickname, this.form.value.email, this.form.value.password);
  }
}
