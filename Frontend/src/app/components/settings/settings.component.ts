import { Component, OnInit } from '@angular/core';
import {ThemeServiceService} from '../../services/theme-service.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {

  constructor(private themeService: ThemeServiceService) {}

  ngOnInit() {}

  toggleTheme(event){
    if(event.detail.checked){
      document.body.setAttribute('color-theme', 'dark');
      this.themeService.makeDark(true);
      this.themeService.darkModeChange.next(true);
      localStorage.setItem('theme', 'dark');
    }
    else{
      document.body.setAttribute('color-theme', 'light');
      this.themeService.makeDark(false);
      this.themeService.darkModeChange.next(false);
      localStorage.setItem('theme', 'light');
    }
  }
}
