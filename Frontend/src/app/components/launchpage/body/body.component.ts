import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {GLoginService} from "../../../services/g-login.service";

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss'],
})
export class BodyComponent implements OnInit {

  constructor(private router: Router,private gLoginService: GLoginService, private ref: ChangeDetectorRef) { }

  ngOnInit() {}

  navigateTo(componentName: string)
  {
    this.router.navigate([componentName]);
  }

  signIn()
  {
    this.gLoginService.signIn();
  }

}
