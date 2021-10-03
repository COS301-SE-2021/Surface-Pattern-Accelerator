import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ThemeServiceService} from "./services/theme-service.service";
import {IonInput} from "@ionic/angular";
import {GLoginService} from "./services/g-login.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent implements OnInit {
  listener;
  singedIn;
  listener_payment;
  payed;
  constructor(private router: Router, private themeService: ThemeServiceService, private gLogin: GLoginService) {

  }

  ngOnInit(): void {
    this.singedIn = this.gLogin.singedIn;
    this.listener = this.gLogin.singedIn.subscribe(value=>{
      this.singedIn = value;
      console.log('value changed to');
      console.log(value);

    })

    this.payed = this.gLogin.hasPaid;
    this.listener_payment = this.gLogin.payed.subscribe(value=>{
      this.payed = value;
      console.log('value changed to');
      console.log(value);

    })

    console.log('listener then value');
    console.log(this.listener);
    console.log(this.singedIn);
    console.log('this.router.url', this.router.url);
    if(localStorage.getItem("theme") === "light")
    {
      document.body.setAttribute('color-theme', 'light');
      this.themeService.makeDark(false);
      this.themeService.darkModeChange.next(false);
    }
    else
    {
      document.body.setAttribute('color-theme', 'dark');
      this.themeService.makeDark(true);
      this.themeService.darkModeChange.next(true);
    }

  }

  details(){
    let user:gapi.auth2.GoogleUser = JSON.parse(sessionStorage.getItem('user')).user;
    console.log(user.getId());
  }

  hasPaid(){
    console.log(this.gLogin.hasPaid);
  }

  signedInCall(){
   // if(JSON.parse(sessionStorage.getItem('token'))){
   //   return true;
   // }
   // else{
   //   return false;
   // }
    return this.singedIn;
  }
  getUserEmail(){
    if(sessionStorage.getItem('token'))
      return JSON.parse(sessionStorage.getItem('token')).email;
    else
      this.gLogin.singedIn.next(false);
  }
  getUserName(){
    if(sessionStorage.getItem('token'))
      return JSON.parse(sessionStorage.getItem('token')).name;
    else
      this.gLogin.singedIn.next(false);
  }


  toggleTheme(event){
    if(event.detail.checked){
      document.body.setAttribute('color-theme', 'dark');
      this.themeService.makeDark(true);
      this.themeService.darkModeChange.next(true);
      localStorage.setItem("theme", "dark");
    }
    else{
      document.body.setAttribute('color-theme', 'light');
      this.themeService.makeDark(false);
      this.themeService.darkModeChange.next(false);
      localStorage.setItem("theme", "light");
    }


  }
}
