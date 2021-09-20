import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from "rxjs";
import { Router } from '@angular/router'
import {GoogleLoginProvider, SocialAuthService, SocialUser} from "angularx-social-login";
import {ServerLinkService} from "./server-link.service";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

 // private serverAPIURL = 'http://localhost:3000';
  //private serverAPIURL = 'http://ec2-3-128-186-246.us-east-2.compute.amazonaws.com:3000';

  loggedIn: Subject<boolean>; //read up on subject observable
  user: SocialUser | null;

  constructor(private http: HttpClient, private router: Router, private authService: SocialAuthService, private serverLink: ServerLinkService) {
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
    this.http.post(this.serverLink.getServerLink() + '/api/login',
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
    const googleLoginURL = this.serverLink.getServerLink() + '/api/googleLogin';

    this.http.get<any>(googleLoginURL, {withCredentials: true}) //with credentials sends cookie
      .subscribe((resp: any) => {
        window.location.href = resp.signInURL;
        console.log(resp.signInURL);
    });
  }

  ////////delete later  ------ --- payment
  makePayment()
  {
    console.log("calling the payment service")
    return "kamau"

   /*return  this.http.post<any>('http://localhost:5000/auth', { paymentData: incomingData }).subscribe({
      next: data => {
        ////this.postId = data.id;
        console.log('received data -> !',data)
      },
      error: error => {
        ////this.errorMessage = error.message;
        console.error('There was an error!', error);
      }
    })*/



  }


}
