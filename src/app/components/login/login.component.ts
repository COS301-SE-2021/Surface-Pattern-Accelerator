import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loggedIn: boolean = false;
  email?: string;
  password?: string;



  constructor(private loginService: LoginService) { }

  ngOnInit() {}

  doLogin() {
    this.loginService.login(this.email, this.password);
  }

  loginWithGoogle() {

  }
}
