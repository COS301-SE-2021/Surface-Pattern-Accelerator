import { Component, OnInit } from '@angular/core';
/*
  Resources used to understand and install Angular material:
  https://material.angular.io/guide/getting-started
  https://material.angular.io/components/button/api
 */
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-svgeditor',
  templateUrl: './svgeditor.component.html',
  styleUrls: ['./svgeditor.component.css']
})
export class SVGeditorComponent implements OnInit {
  /*
      Resources used to understand this implementation:
      https://blog.angular-university.io/angular-file-upload/
   */
  fileName: string;

  constructor() {
    this.fileName = "";
  }

  ngOnInit(): void {
  }

  onFileSelected($event: Event) {

  }
}
