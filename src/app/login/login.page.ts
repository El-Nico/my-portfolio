import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form: FormGroup
  userData: any
  loginSpinner: boolean
  constructor(public formBuilder: FormBuilder, public afAuth: AngularFireAuth, private router: Router, public ngZone: NgZone, public authSevice: AuthService) { }

  ngOnInit() {
    if (!this.authSevice.isAuthenticated()) {
      this.router.navigate(['/login/admin'])
    }
    this.form = this.formBuilder.group({
      'email': new FormControl(null, Validators.email),
      'password': new FormControl(null)
    })
  }

  signIn() {
    this.loginSpinner = true
    this.afAuth.signInWithEmailAndPassword(this.form.value.email, this.form.value.password)
      .then((result) => {
        this.loginSpinner = false
        this.ngZone.run(() => {
          this.router.navigate(['/login/admin']);
        });
        this.SetUserData = result.user
        this.form.setValue({
          'email': null,
          'password': null,
        })
      }).catch((error) => {
        this.loginSpinner = false
        window.alert(error.message)
      })
  }

  set SetUserData(user) {
    localStorage.removeItem('user');
    this.userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      createdOn: new Date().getTime()
    }
    localStorage.setItem('user', JSON.stringify(this.userData));
  }
}
