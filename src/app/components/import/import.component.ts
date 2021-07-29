import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
})

export class ImportComponent implements OnInit {
  clicked = false;
  //title = "Import";

  constructor() {
    const img = new Image();
    const fileName  = '';
    const canvas  = <HTMLElement>document.getElementById('canvas');
    //const ctx = (canvas).getContext("2d");
  }

  ngOnInit() {
  }

  handleclick()
  {
    this.clicked = true;
  }

}
