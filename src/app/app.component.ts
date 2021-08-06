import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {
  //failed attempt at hading a tab bar
  //static tabBar: any = <HTMLElement>document.getElementById('tab-bar1');
  static tabBar: any;
constructor() {
  AppComponent.tabBar = <HTMLElement>document.getElementById('tab-bar1');
}
}
