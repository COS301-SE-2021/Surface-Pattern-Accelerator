import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {GLoginService} from "../../services/g-login.service"
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-g-login',
  templateUrl: './g-login.component.html',
  styleUrls: ['./g-login.component.scss'],
})
export class GLoginComponent implements OnInit {
  private serverAPIURL = 'http://localhost:3000/api';
  user: any;

  constructor(private gLoginService: GLoginService, private ref: ChangeDetectorRef, private http: HttpClient) {

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
