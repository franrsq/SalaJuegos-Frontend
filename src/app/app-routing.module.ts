import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Componentes inicio de sesión
import { ForgotPasswordComponent } from '../app/components/forgot-password/forgot-password.component';
import { LoginComponent } from '../app/components/login/login.component';
import { SignUpComponent } from '../app/components/sign-up/sign-up.component';
import { ChooseGameComponent } from './components/choose-game/choose-game.component';
import { GameBoardComponent } from './components/game-board/game-board.component';

import { AngularFireAuthGuard } from '@angular/fire/auth-guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register-user', component: SignUpComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'choose-game', component: ChooseGameComponent, canActivate: [AngularFireAuthGuard] },
  { path: 'game-board', component: GameBoardComponent, canActivate: [AngularFireAuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
