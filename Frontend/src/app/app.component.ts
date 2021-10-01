import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ThemeServiceService} from "./services/theme-service.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent implements OnInit {
  constructor(private router: Router, private themeService: ThemeServiceService) {

  }

  ngOnInit(): void {
    console.log('this.router.url', this.router.url);
    this.themeService.makeDark(false);
  }

  toggleTheme(event){
    if(event.detail.checked){
      document.body.setAttribute('color-theme', 'dark');
      this.themeService.makeDark(true);
      this.themeService.darkModeChange.next(true);
    }
    else{
      document.body.setAttribute('color-theme', 'light');
      this.themeService.makeDark(false);
      this.themeService.darkModeChange.next(false);
    }


  }
}
