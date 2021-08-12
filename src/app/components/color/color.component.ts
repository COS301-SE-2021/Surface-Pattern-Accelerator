import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.scss'],
})

export class ColorComponent implements OnInit {
  svgName: any;
  patternName: any;

  constructor() { }

  ngOnInit() {
    this.colorGenerator();
  }

  // Modern approach to the equivalent PHP function file_get_contents()
  // Reads the contents of a file into a string
  //**** Resource used: https://stackoverflow.com/questions/10693518/is-there-a-javascript-way-to-do-file-get-contents
  async file_get_contents(uri, callback) {
    let res = await fetch(uri), ret = await res.text();
    let divExample  = <HTMLDivElement>document.getElementById("divOutput");
    // Insert SVG code directly into html
    divExample.innerHTML  = ret;
    return callback ? callback(ret) : ret; // a Promise() actually.
  }

  // **** this function searches through an *imported svg
  // changing all the fill colors to one specified by the user
  LoadToExpandedView() {
    // For illustration, file source is retried from image source
    // Mimicking working with an uploaded SVG source file
    let imageCC = <HTMLImageElement>document.getElementById('output');
    // Gets SVG source code and inserts it into the html
    let out = this.file_get_contents(imageCC.src, console.log);
    // Access the inserted svg element
    let divCC = <HTMLElement>document.getElementById("divOutput");
    let divChildren = divCC.children;
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
    let div = <HTMLElement>document.getElementById("divOutput");
    let divC  = div.children;
    let svg	= divC[0];
    // Get color value from user
    let colorPicker = <HTMLInputElement>document.getElementById('fav_color');

    // Store color value specified by user
    let color	= colorPicker.value;

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
    if (node.childElementCount == 0) {
      // Make sure we are not working with undefined nodes
      if (!(typeof node === 'undefined')) {
        console.log('Changing the node color, through recursive node search: ',node.tagName);
        // Check if the node has a specified node fill color
        if (node.hasAttribute('fill')) {
          node.setAttribute('fill',colorValue);
        }
        // Some SVGs set their fill in the style attribute
        // Check if the node has the style attribute
        if (node.hasAttribute('style')) {
          node.style.fill = colorValue;
        }
      }
      // Leave recursive call
      return;
    }
    else if (node.childElementCount > 0) {
      // Store children of node in array
      let nodeChildren  = node.children;
      // Iterate through the individual node children and call the recursive function
      for (let j = 0; j < nodeChildren.length; j++) {
        // Make sure we are not working with undefined nodes
        if (!(typeof nodeChildren[j] === 'undefined')) {
          this.recursiveNodeSearch(nodeChildren[j],colorValue);
        }
      }
    }
  }

  save_svg() {
    let svgEl;
    svgEl = document.getElementById("test");
    //svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    const svgData = svgEl.outerHTML;
    const preface = '<?xml version="1.0" standalone="no"?>\r\n';
    const svgBlob = new Blob([ preface,'<svg xmlns="http://www.w3.org/2000/svg">',
        svgData, '</svg>'], {type: "image/svg+xml;charset=utf-8"});
    let svgUrl = URL.createObjectURL(svgBlob);
    let downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "SVG_element";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  // Import SVG and display it in image file.
  // TODO modify it to display image in canvas and load from google drive
  importSVG() {
    let fileInput = <HTMLInputElement>document.getElementById('c-upload-file');
    let image = <HTMLImageElement>document.getElementById('output');
    // Trigger the hidden input type='file' html element
    fileInput.click();
    // Activates when a user selects a file and a change event is fired by the browser
    fileInput.addEventListener('change', ()=> {
      let file = fileInput.files[0];
      // Check for file
      if (file) {
        try {
          // Loads the uploaded file to the html src attribute
          image.src = URL.createObjectURL(file);
          // Changes the pattern name in the UI
          this.patternName  = file.name;
          // Display the image html that was hidden
          image.style.display = 'block';
          return this.LoadToExpandedView();
        } catch (err) {
          // For debugging purposes
          console.log(err.message);
        }
      }
    })
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

  lockColor(id: string){
    const elem = document.getElementById(id);
    let prev: HTMLElement;
    let next: HTMLElement;

    if(elem) {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      prev = <HTMLElement>elem.previousElementSibling;
      console.log('color div class: ' + prev.className);
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      next = <HTMLElement>elem.nextElementSibling;
      console.log('p class: ' + next.className);
    }

    if(prev.className === 'colors'){
      prev.classList.remove('colors');
      prev.classList.add('stay-colors');
      prev.style.backgroundColor = next.innerHTML;
      console.log('prev.style.backgroundColor: ' + prev.style.backgroundColor);
      next.classList.remove('codes');
      next.classList.add('new-codes');
      elem.innerHTML = 'Unlock';
    }
    else if(prev.className === 'stay-colors'){
      prev.classList.remove('stay-colors');
      prev.classList.add('colors');
      prev.style.backgroundColor = next.innerHTML;
      next.classList.remove('new-codes');
      next.classList.add('codes');
      elem.innerHTML = 'Lock';
    }

  }
}
