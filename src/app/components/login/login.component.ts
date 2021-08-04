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

  constructor(private loginService: LoginService) {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const tabBar: any = <HTMLElement>document.getElementById('tab-bar1');
    tabBar.style.hidden = true;
  }

  ngOnInit() {}

  doLogin() {
    this.loginService.loginWithGoogle();
  }

  loginWithGoogle() {}
}
