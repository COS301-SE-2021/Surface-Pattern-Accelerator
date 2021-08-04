import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-canvas-colours',
  templateUrl: './canvas-colours.component.html',
  styleUrls: ['./canvas-colours.component.scss'],
})
export class CanvasColoursComponent implements OnInit {

  colourList = [];
  htmlToAdd: any;
  constructor() {}

  ngOnInit() {
      this.draw();

  }

  draw(){
    const canvas = <HTMLCanvasElement> document.getElementById('canvas');
    const ctx = <CanvasRenderingContext2D> canvas.getContext('2d');

    let img = new Image();
    img.src="../assets/shapes.svg";
    img.onload = () =>{
      ctx.drawImage(img,0,0);
    }
  }




}

