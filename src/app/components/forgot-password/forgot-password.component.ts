import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth-service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

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
      email: ['', Validators.required]
    });
  }

  restorePassword() {
    this.authService.ForgotPassword(this.form.value.email)
      .then(() => {
        this.toastr.success('Correo enviado exitosamente');
      })
      .catch((error) => {
        this.toastr.error('Hubo un error durante el envío del correo');
      });;
  }

}
