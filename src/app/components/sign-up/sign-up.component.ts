import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth-service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  form: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
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

  register() {
    if (this.form.value.password == this.form.value.confirmPassword) {
      this.authService.SignUp(this.form.value.nickname, this.form.value.email, this.form.value.password)
        .then(() => {
          this.toastr.success('Registro realizado exitosamente');
        })
        .catch((error) => {
          this.toastr.error('Hubo un error durante el registro');
        });
    } else {
      this.toastr.error('Las contraseñas no coinciden');
    }
  }
}
