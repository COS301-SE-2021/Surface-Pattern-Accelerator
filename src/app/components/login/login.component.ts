import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loggedIn: boolean = false;
  email: any;
  password: any;

  constructor() { }

  ngOnInit() {}

  doLogin() {

  }
}
