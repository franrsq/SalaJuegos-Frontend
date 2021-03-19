import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Angular Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatRadioModule } from '@angular/material/radio';

//Firebase
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { environment } from 'src/environments/environment';
import { AuthService } from "./shared/services/auth.service";
import { USE_EMULATOR as USE_AUTH_EMULATOR } from '@angular/fire/auth';
import { USE_EMULATOR as USE_DATABASE_EMULATOR } from '@angular/fire/database';

// Components
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ChooseGameComponent } from './components/choose-game/choose-game.component'

import { ToastrModule } from 'ngx-toastr';
import { GameBoardComponent } from './components/game-board/game-board.component';
import { NewCheckersDialogComponent } from './components/new-checkers-dialog/new-checkers-dialog.component';
import { NicknameDialogComponent } from './components/nickname-dialog/nickname-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    ChooseGameComponent,
    GameBoardComponent,
    NewCheckersDialogComponent,
    NicknameDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    FormsModule,
    HttpClientModule,
    MatSnackBarModule,
    HttpClientModule,
    MatDialogModule,
    MatCardModule,
    FlexLayoutModule,
    ToastrModule.forRoot(),
    MatRadioModule,
  ],
  providers: [
    AuthService,
    { provide: USE_AUTH_EMULATOR, useValue: environment.useEmulators ? ['localhost', 9099] : undefined },
    { provide: USE_DATABASE_EMULATOR, useValue: environment.useEmulators ? ['localhost', 9000] : undefined },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
