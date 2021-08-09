import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-canvas-colours',
  templateUrl: './canvas-colours.component.html',
  styleUrls: ['./canvas-colours.component.scss'],
})
export class CanvasColoursComponent implements OnInit {

  colourList = [];
  constructor() {}

  ngOnInit() {
    this.draw();
    document.getElementById('canvas').onclick = ()=>{
      this.canvasColour();
    }

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

    for(i = 0, n = data.length; i < n; i += 4){
      let r  = data[i];
      let g  = data[i + 1];
      let b  = data[i + 2];
      let hex = this.rgbToHex("rgb("+r+","+g+","+b+")");

      if (!(hex in this.colourList)){
        this.colourList[hex] = 1;
      }
      else {
        this.colourList[hex]++;
      }
    }
    // keys are the elements are strings corresponding to the enumerable properties found directly upon object
    let keys = Object.keys(this.colourList);

    keys.sort();

    // remove duplicate keys
    let used = [];
    let prev = '';

    console.log("before loop");
    let count: number = 0;
    for (i =0; i < keys.length; i++){
      console.log("in loop");

      if(!used.includes(this.colourList[keys[i]])){
        if(prev != keys[i].charAt(1)){
          used.push(this.colourList[keys[i]]);

          let item = <HTMLElement> document.querySelector('#item'+ count);
          console.log(keys[i]);
          item.style.backgroundColor = keys[i];
          item.innerHTML = keys[i];

          prev = keys[i].charAt(1);
          count++;
        }
      }
    }
  }

  rgbToHex(str: string){
    let rgb = str.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
      return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
  }


}
