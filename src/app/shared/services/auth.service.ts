import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { AngularFireAuth } from "@angular/fire/auth";
import firebase from 'firebase/app';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from "@angular/router";
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  userData: User; // Save logged in user data
  nickNameSubscription: Subscription;

  constructor(
    public firebase: AngularFireDatabase,
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router
  ) {
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = {
          uid: user.uid,
          email: user.email,
          nickname: null,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified
        };
        localStorage.setItem('user', JSON.stringify(user));
        JSON.parse(localStorage.getItem('user'));
        if (this.nickNameSubscription) {
          this.nickNameSubscription.unsubscribe();
        }
        this.nickNameSubscription = this.firebase.object('users/' + user.uid)
          .valueChanges()
          .subscribe((data: any) => {
            if (data) {
              this.userData['nickname'] = data.nickname;
              localStorage.setItem('nickname', JSON.stringify(data));
            } else {
              localStorage.setItem('nickname', null);
            }
            this.router.navigate(['choose-game']);
          });
      } else {
        localStorage.setItem('user', null);
        localStorage.setItem('nickname', null);
        JSON.parse(localStorage.getItem('user'));
      }
    });
  }

  // Sign in with email/password
  SignIn(email, password) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  // Sign up with email/password
  SignUp(nickname, email, password) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign 
        up and returns promise */
        this.SendVerificationMail();
        this.saveNickName(nickname, result.user);
      });
  }

  // Send email verfificaiton when new user sign up
  async SendVerificationMail() {
    return (await this.afAuth.currentUser).sendEmailVerification();
  }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail) {
    return this.afAuth.sendPasswordResetEmail(passwordResetEmail);
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false) ? true : false;
  }

  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new firebase.auth.GoogleAuthProvider());
  }

  // Auth logic to run auth providers
  AuthLogin(provider) {
    return this.afAuth.signInWithPopup(provider);
  }

  saveNickname(nickname) {
    this.saveNickName(nickname, this.userData);
  }

  private saveNickName(nickname, user) {
    const userRef = this.firebase.object(`users/${user.uid}`);
    const userData = {
      nickname: nickname,
    };
    return userRef.set(userData);
  }

  // Sign out 
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      localStorage.setItem('nickname', null);
      this.router.navigate(['sign-in']);
    });
  }
}