import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Subject} from "rxjs";
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private serverAPIURL = 'http://localhost:3000/api';

  loggedIn: Subject<boolean>; //read up on subject observable

  constructor(private http: HttpClient, private router: Router) {
    this.loggedIn = new Subject();
  }

  login(email: string, password: string)
  {
    console.log(email);
    console.log(password);
    this.http.post(this.serverAPIURL + '/login',
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
}
