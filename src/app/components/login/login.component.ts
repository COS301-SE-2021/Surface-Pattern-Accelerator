import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';

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

  constructor(private loginService: LoginService) {
  }

  ngOnInit() {}

  doLogin() {
    this.loginService.loginWithGoogle();
  }

  loginWithGoogle() {

  }
}
