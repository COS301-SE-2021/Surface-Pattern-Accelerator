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
    document.getElementById('canvasExtractor').onclick = ()=>{
      this.canvasColour();
    };
  }

  draw(){
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const canvas = <HTMLCanvasElement> document.getElementById('canvasExtractor');
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
    const canvas = <HTMLCanvasElement> document.getElementById('canvasExtractor');
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const ctx = <CanvasRenderingContext2D> canvas.getContext('2d');
    const imageData = ctx.getImageData(0,0,canvas.width, canvas.height);
    const data = imageData.data;
    let i; let n; let ret=1;


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
          const item = <HTMLElement> document.querySelector('#it'+ count);
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

  // Import SVG & Image files and display them on the canvas
  import() {
    // Return element
    let ret = null;
    // Get access to the canvas element
    const canvas = <HTMLCanvasElement>document.getElementById("canvasExtractor");
    // Specify the canvas context
    const ctx = canvas.getContext("2d");
    // Specify image object
    let img = new Image();
    // Get access to the file input element
    let fileInput = <HTMLInputElement>document.getElementById('cc-upload-file');
    // Init FileReader API
    const reader = new FileReader();
    // Trigger the hidden input type='file' html element
    fileInput.click();
    // Activates when a user selects a file and a change event is fired by the browser
    fileInput.addEventListener('change', ()=> {
      let file = fileInput.files[0];
      // Check for file
      if (file) {
        try {
          // Read data as URL
          reader.readAsDataURL(file);
        } catch (err) {
          // For debugging purposes
          console.log(err.message);
        }
      }
    });

    // Add image to canvas
    reader.addEventListener(
      "load",
      () => {
        // Create image
        img = new Image();
        // Set image src
        img.src = <string>reader.result;
        // On image load add to canvas
        img.onload = function() {
          // Sets a limit to the size of image displayed
          if (img.width > 300) {
            img.width  = 300;
            if (img.height > 200) {
              img.height  = 200;
            }
          }
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0, img.width, img.height);
          canvas.removeAttribute("data-caman-id");
        };
      },
      false
    );
    return ret;
  }

}

