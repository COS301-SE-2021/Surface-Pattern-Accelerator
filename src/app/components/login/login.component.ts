import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import {NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loggedIn = false;
  email?: string;
  password?: string;

  /*
  This public variable is to prevent the tab bar
  from appearing in the login screen
   */
  public currentUrl: string;

  constructor(private loginService: LoginService, private router: Router) {
    // @ts-ignore
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        console.log('loading finished', event);
        this.currentUrl = event.url.split('/').join('-');
      }
    });
  }

  ngOnInit() {}

  doLogin() {
    this.loginService.loginWithGoogle();
  }

  loginWithGoogle() {

  }
}
