import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css']
})
export class ImportComponent implements OnInit {

  clicked = false;
  title = "Import";

  constructor() { }

  ngOnInit() {
  }

  handleclick()
  {
      this.clicked = true;
  }


  // onFileUpload(event){
  //   const file = event.target.files[0];
  // }












}



