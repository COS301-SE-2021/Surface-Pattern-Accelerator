import { Component, OnInit } from '@angular/core';
/*
  Resources used to understand and install Angular material:
  https://material.angular.io/guide/getting-started
  https://material.angular.io/components/button/api

  For future reference:
  https://angular.io/guide/svg-in-templates
 */
//import {MatButtonModule} from '@angular/material/button';
//import {HttpClient} from "@angular/common/http";

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

  fileName = "";
  //mime type for svg to only accept svg files in the input html element.
  requiredFileType  = "image/svg+xml";
  url = "";

  constructor() {
  }

  ngOnInit(): void {
  }


  onFileSelected($event: Event) {
    //The ! operator shows typescript my confidence that a null value will not be returned
    //The event is also type-casted as a HTMLInputElement, so the compiler can assess the files element
    // @ts-ignore
    const file:File = ($event.target as HTMLInputElement).files[0];
    this.url  = URL.createObjectURL(file);
    if (file) {
      this.fileName = file.name;
    }
  }


}
