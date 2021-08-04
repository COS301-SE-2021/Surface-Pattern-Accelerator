import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  show: boolean;
  public currentUrl: string;

  constructor(private router: Router) {
    this.show = false;
    this.currentUrl = this.router.url;
  }
}
