import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth-service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    public authService: AuthService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    // Valida los campos requeridos
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    this.authService.SignIn(this.form.value.email, this.form.value.password)
      .then(() => {
        this.toastr.success('Inicio de sesión exitoso');
      })
      .catch((error) => {
        this.toastr.error('Hubo un error al iniciar sesión');
      });
  }

  loginGoogle() {
    this.authService.GoogleAuth()
      .then(() => {
        this.toastr.success('Inicio de sesión exitoso');
      })
      .catch((error) => {
        this.toastr.error('Hubo un error al iniciar sesión');
      });
  }

}
