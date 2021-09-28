import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent implements OnInit {
constructor(private router: Router) {

}

  ngOnInit(): void {
  console.log('this.router.url', this.router.url);
  }

  toggleTheme(event){
    if(event.detail.checked){
      document.body.setAttribute('color-theme', 'dark');
    }
    else{
      document.body.setAttribute('color-theme', 'light');
    }
  }
}
