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

  canvasColour(){
    const canvas = <HTMLCanvasElement> document.getElementById('canvas');
    const ctx = <CanvasRenderingContext2D> canvas.getContext('2d');
    let imageData = ctx.getImageData(0,0,canvas.width, canvas.height);
    const data = imageData.data;
    let i,n;

  }

  rgbToHex(str: string){
    let rgb = str.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

    function hex(x) {
      return ("0" + parseInt(x).toString(16)).slice(-2);
    }

    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
  }


}

