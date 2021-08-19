import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from "rxjs";
import { Router } from '@angular/router'
import {GoogleLoginProvider, SocialAuthService, SocialUser} from "angularx-social-login";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private serverAPIURL = 'http://localhost:3000';
  //private serverAPIURL = 'http://ec2-3-128-186-246.us-east-2.compute.amazonaws.com:3000';

  loggedIn: Subject<boolean>; //read up on subject observable
  user: SocialUser | null;

  constructor(private http: HttpClient, private router: Router, private authService: SocialAuthService) {
    this.loggedIn = new Subject();
    this.user = null;
    this.authService.authState.subscribe((user: SocialUser) => {
      console.log(user);
      this.user = user;
    });
  }

  //deprecated login
  login(email: string, password: string)
  {
    console.log(email);
    console.log(password);
    this.http.post(this.serverAPIURL + '/api/login',
      { email: email, password: password},
      {withCredentials: true
      }).subscribe((resp: any) => {
        this.loggedIn.next(true); //read up on next of a subject
        console.log("Logged in success");
        this.router.navigate(['collections']);
    }, (errorResp => {
        this.loggedIn.next(false);
      console.log("Logged in failed");
    }))
  }

  loginWithGoogle()
  {
    console.log("Google sign in fired!");
    const googleLoginURL = this.serverAPIURL + '/api/googleLogin';

    this.http.get<any>(googleLoginURL, {withCredentials: true}) //with credentials sends cookie
      .subscribe((resp: any) => {
        window.location.href = resp.signInURL;
        console.log(resp.signInURL);
    });
  }


}