import { Component, OnInit } from '@angular/core';
import {StageColorService} from '../../services/stage-color.service';

@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.scss'],
})

export class ColorComponent implements OnInit {
  colourList = [];
  svgName: any;
  patternName: any;
  img: any;
  public imgSrc: string;

  constructor(private stageColorService: StageColorService) { }

  ngOnInit() {
    this.colorGenerator();

    this.stageColorService.stage$
        .subscribe(
          image => {
            console.log('image subscription'+ image);
              this.imgSrc = image;
            });

    document.getElementById('onlyImage').onload =() => {
      this.draw();
      document.getElementById('onlyImage').onclick = ()=>{
        this.canvasColour();
      };
    };
  }

  // Modern approach to the equivalent PHP function file_get_contents()
  // Reads the contents of a file into a string
  //**** Resource used: https://stackoverflow.com/questions/10693518/is-there-a-javascript-way-to-do-file-get-contents
  async fileGetContents(uri, callback) {
    const res = await fetch(uri);
    const ret = await res.text();
    const divExample  = document.getElementById('divOutput') as HTMLElement;
    // Insert SVG code directly into html
    divExample.innerHTML  = ret;
    return callback ? callback(ret) : ret; // a Promise() actually.
  }

  // **** this function searches through an *imported svg
  // changing all the fill colors to one specified by the user
  loadToExpandedView() {
    // For illustration, file source is retried from image source
    // Mimicking working with an uploaded SVG source file
    const imageCC = document.getElementById('output') as HTMLImageElement;
    // Gets SVG source code and inserts it into the html
    const out = this.fileGetContents(imageCC.src, console.log);
    // Access the inserted svg element
    const divCC = document.getElementById('divOutput') as HTMLElement;
    const divChildren = divCC.children;
    // Error check to make sure SVG was inserted
    if (divChildren[0] == null) {
      console.log('Error in changeColor(): SVG was not inserted into div container.');
      return null;
    }
    // divChildren[0] should contain the inserted SVG element
    // we can set its id attribute, so we call the changeFill() function
    divChildren[0].setAttribute('id','test');
    // Call changeFill() to change fill with svg of the set id.

    return out; // Promise()
  }

  // **** this function searches through an svg
  // changing all the fill colors to one specified by the user
  changeFill() {
    // Get the inserted SVG element from the html document
    const div = document.getElementById('divOutput') as HTMLElement;
    const divC  = div.children;
    const svg	= divC[0];
    // Get color value from user
    const colorPicker = document.getElementById('fav_color') as HTMLInputElement;

    // Store color value specified by user
    const color	= colorPicker.value;

    // Search through the svg and change fill color for child nodes
    this.recursiveNodeSearch(svg, color);
    return true;
  }

  // Changes the fill color, by color text inserted by a user
  changeFillText() {
    // Get the inserted SVG element from the html document
    const div = document.getElementById('divOutput') as HTMLElement;
    const divC  = div.children;
    const svg	= divC[0];
    // Get color value from user
    const colorPicker = document.getElementById('textColor') as HTMLInputElement;
    // Store color value specified by user
    const color	= colorPicker.value;
    // Search through the svg and change fill color for child nodes
    this.recursiveNodeSearch(svg, color);
    return true;
  }

  // Recursively search through the node, and iterate through all child nodes on
  // all levels.
  recursiveNodeSearch(node, colorValue) {
    if (node == null) {
      return;
    }
    // Base case for recursive function
    if (node.childElementCount === 0) {
      // Make sure we are not working with undefined nodes
      if (!(typeof node === 'undefined')) {
        console.log('Changing the node color, through recursive node search: ',node.tagName);
        // Some SVGs set their fill in the style attribute
        // Check if the node has the style attribute
        if (node.hasAttribute('style')) {
          node.style.fill = colorValue;
        }
        // Check if the node has a specified node fill color
        else if (node.hasAttribute('fill')) {
          node.setAttribute('fill',colorValue);
        }
        else {
          node.setAttribute('fill',colorValue);
        }
      }
      // Leave recursive call
      return;
    }
    else if (node.childElementCount > 0) {
      // Store children of node in array
      const nodeChildren  = node.children;
      // Iterate through the individual node children and call the recursive function
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for(let j = 0; j < nodeChildren.length; j++) {
        // Make sure we are not working with undefined nodes
        if (!(typeof nodeChildren[j] === 'undefined')) {
          this.recursiveNodeSearch(nodeChildren[j],colorValue);
        }
      }
    }
  }

  saveSvg() {
    // Get the inserted SVG element from the html document
    const div = document.getElementById('divOutput') as HTMLElement;
    const divC  = div.children;
    const svgEl	= divC[0];
    //svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    const svgData = svgEl.outerHTML;
    // Required preface in every svg code file
    const preface = '<?xml version="1.0" standalone="no"?>\r\n';
    // Create blob
    const svgBlob = new Blob([ preface,'<svg xmlns="http://www.w3.org/2000/svg">',
        svgData, '</svg>'], {type: 'image/svg+xml;charset=utf-8'});
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = 'SVG_element';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  // Import SVG and display it in image file.
  // TODO modify it to display image in canvas and load from google drive
  importSVG() {
    const fileInput = document.getElementById('c-upload-file') as HTMLInputElement;
    const image = document.getElementById('output') as HTMLImageElement;
    // Trigger the hidden input type='file' html element
    fileInput.click();
    // Activates when a user selects a file and a change event is fired by the browser
    fileInput.addEventListener('change', ()=> {
      const file = fileInput.files[0];
      // Check for file
      if (file) {
        try {
          // Loads the uploaded file to the html src attribute
          image.src = URL.createObjectURL(file);
          // Changes the pattern name in the UI
          this.svgName  = ' : ' + file.name;
          // Display the image html that was hidden
          //image.style.display = 'block';
          return this.loadToExpandedView();
        } catch (err) {
          // For debugging purposes
          console.log(err.message);
        }
      }
    });
    return null;
  }

  colorGenerator(){

    const codes = document.querySelectorAll('.codes');
    const colors = document.querySelectorAll('.colors');
    const letters = '0123456789abcdef';
    const hashtag = ['#','#','#','#','#','#'];

    for (let i=0;i<6;i++){
      hashtag[i]+=letters[Math.floor(Math.random()*16)];
      hashtag[i]+=letters[Math.floor(Math.random()*16)];
      hashtag[i]+=letters[Math.floor(Math.random()*16)];
      hashtag[i]+=letters[Math.floor(Math.random()*16)];
      hashtag[i]+=letters[Math.floor(Math.random()*16)];
      hashtag[i]+=letters[Math.floor(Math.random()*16)];
    }

    for (let i=0;i<codes.length;i++){

      codes[i].innerHTML = hashtag[i];

      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const c = <HTMLElement> colors[i];
      c.style.backgroundColor = hashtag[i];
    }
  }

  lockColor(id: string) {
    const elem = document.getElementById(id);
    let prev: HTMLElement;
    let next: HTMLElement;

    if (elem) {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      prev = <HTMLElement>elem.previousElementSibling;
      console.log('color div class: ' + prev.className);
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      next = <HTMLElement>elem.nextElementSibling;
      console.log('p class: ' + next.className);
    }

    if (prev.className === 'colors') {
      prev.classList.remove('colors');
      prev.classList.add('stay-colors');
      prev.style.backgroundColor = next.innerHTML;
      console.log('prev.style.backgroundColor: ' + prev.style.backgroundColor);
      next.classList.remove('codes');
      next.classList.add('new-codes');
      elem.innerHTML = 'Unlock';
    } else if (prev.className === 'stay-colors') {
      prev.classList.remove('stay-colors');
      prev.classList.add('colors');
      prev.style.backgroundColor = next.innerHTML;
      next.classList.remove('new-codes');
      next.classList.add('codes');
      elem.innerHTML = 'Lock';
    }
  }
  draw(){ //TODO: remove when merged with other canvas
    console.log('draw executing');
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const canvas = <HTMLCanvasElement> document.getElementById('canvas');
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const ctx = <CanvasRenderingContext2D> canvas.getContext('2d');

    const img = new Image();
    img.src = this.imgSrc;
    img.onload = () =>{
      ctx.drawImage(img,0,0);
      console.log('image drawn');
    };
    console.log('draw called');
  }

  canvasColour(){
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const canvas = <HTMLCanvasElement> document.getElementById('canvas');
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const ctx = <CanvasRenderingContext2D> canvas.getContext('2d');
    const imageData = ctx.getImageData(0,0,canvas.width, canvas.height);
    const data = imageData.data;
    let i; let n;
    let ret = '';


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
          const item = document.querySelector('#item'+ count) as HTMLElement;
          const hx = document.querySelector('#hx'+ count) as HTMLElement;
          console.log(keys[i]);
          item.style.backgroundColor = keys[i];
          hx.innerHTML = keys[i];

          prev = keys[i].charAt(1);
          count++;
          ret += keys[i] + ',';
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
