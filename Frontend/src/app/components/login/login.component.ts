import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {GLoginService} from "../../services/g-login.service";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent implements OnInit {
  private serverAPIURL = 'http://localhost:3000/api';
  user: any;

  constructor(private gLoginService: GLoginService, private ref: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.gLoginService.observable().subscribe(user => {
      this.user = user;
      console.log(user);
      this.ref.detectChanges();
    })
  }

  signIn()
  {
    console.log("Test");
    this.gLoginService.signIn();
  }

  signOut()
  {
    this.gLoginService.signOut();
  }



  printFile() {
    this.gLoginService.printFile("1uBUHbTjn1NuTIV6M9DhLHmT9dY1hs6Wm");
  }
}
