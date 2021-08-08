import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import {AppComponent} from '../../app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent implements OnInit {
  loggedIn = false;
  email?: string;
  password?: string;

  constructor(private loginService: LoginService) {

    /*
    * Attempt at hiding tab bar in login page.
     */
    if (AppComponent.tabBar != null) {
      AppComponent.tabBar.style.hidden = true;
    }

  }

  ngOnInit() {}

  doLogin() {
    this.loginService.loginWithGoogle();
  }

  loginWithGoogle() {}
}
