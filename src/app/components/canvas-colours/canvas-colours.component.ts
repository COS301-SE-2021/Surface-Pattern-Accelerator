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
    };
  }

  draw(){
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const canvas = <HTMLCanvasElement> document.getElementById('canvas');
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const ctx = <CanvasRenderingContext2D> canvas.getContext('2d');

    const img = new Image();
    img.src='../assets/shapes.svg';
    img.onload = () =>{
      ctx.drawImage(img,0,0);
    };
  }

  canvasColour(){
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const canvas = <HTMLCanvasElement> document.getElementById('canvas');
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const ctx = <CanvasRenderingContext2D> canvas.getContext('2d');
    const imageData = ctx.getImageData(0,0,canvas.width, canvas.height);
    const data = imageData.data;
    let i; let n; let ret=0;


    for(i = 0, n = data.length; i < n; i += 4){
      const r  = data[i];
      const g  = data[i + 1];
      const b  = data[i + 2];
      const hex = this.rgbToHex('rgb('+r+','+g+','+b+')');

      if (!(hex in this.colourList)){
        this.colourList[hex] = 1;
      }
      else {
        this.colourList[hex]++;
      }
    }
    // keys are the elements are strings corresponding to the enumerable properties found directly upon object
    const keys = Object.keys(this.colourList);

    keys.sort();

    // remove duplicate keys
    const used = [];
    let prev = '';

    console.log('before loop');
    let count = 0;
    for (i =1; i < keys.length; i++){
      console.log('in loop');

      if(!used.includes(this.colourList[keys[i]])){
        // eslint-disable-next-line eqeqeq
        if(prev != keys[i].charAt(1)){
          used.push(this.colourList[keys[i]]);

          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          const item = <HTMLElement> document.querySelector('#item'+ count);
          console.log(keys[i]);
          item.style.backgroundColor = keys[i];
          item.innerHTML = keys[i];

          prev = keys[i].charAt(1);
          count++;
          ret=1;
        }
      }
    }
    return ret;
  }

  rgbToHex(str: string){
    const rgb = str.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
    function hex(x) {
      return ('0' + parseInt(x, 10).toString(16)).slice(-2);
    }
    return '#' + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
  }


}

