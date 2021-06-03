import {Component, OnInit} from '@angular/core';
import * as caman from 'src/app/import/Caman.js';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css']
})

export class ImportComponent implements OnInit {
  clicked = false;
  //title = "Import";

  constructor() {
    let img = new Image();
    let fileName  = "";
    const canvas  = <HTMLElement>document.getElementById("canvas");
    //const ctx = (canvas).getContext("2d");
  }

  ngOnInit() {
  }

  handleclick()
  {
      this.clicked = true;
  }


  // onFileUpload(event){
  //   const file = event.target.files[0];
  // }
//made change that wasnt recorded in hyperperform











}



