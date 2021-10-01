import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ThemeServiceService {
  isDarkMode: boolean;

  darkModeChange: Subject<boolean> = new Subject<boolean>();

 // public isDarkMode: boolean;
  constructor() { }

  makeDark(val: boolean){
    this.isDarkMode = val;

  }

  toggleSidebarVisibility(value: boolean) {
    this.darkModeChange.next(value);
  }

}
