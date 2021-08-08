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

  ngOnInit() {}

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
  changeColor() {
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
    // this.changeFill();

    return out; // Promise()
  }

  // **** this function searches through an svg
  // changing all the fill colors to one specified by the user

  changeFill() {
    //**** this code section will be replaced by dynamic svg selection ****
    let svg	= document.getElementById('test');
    let colorPicker = <HTMLInputElement>document.getElementById('fav_color');

    //**** universal code ****
    let color	= colorPicker.value;

    //**** Searches through the svg and changes fill color for child nodes ****

    // An array of child nodes of the SVG
    let nodes = svg.children;
    // ******************************* Debugging code *******************************
    // Process of printing child nodes by name in the console for debugging
    let c = svg.childNodes;
    let text  = '';
    let i;
    for (i = 0; i < c.length; i++) {
      text  = text + c[i].nodeName + '  ';
    }
    console.log('Child nodes discovered in the SVG: ' +text);
    console.log('Number of child elements SVG has: ' + svg.childElementCount);
    // ******************************************************************************
    // Iterating through the child nodes
    for (let k  =  0; k < nodes.length; k++) {
      if (!(typeof nodes[k] === 'undefined')) {
        console.log('Color component, changeFill(): ',nodes[k].tagName);
        if (nodes[k].hasAttribute('fill') && typeof nodes[k].hasAttribute('fill') !== 'undefined') {
          nodes[k].setAttribute('fill', color);
        }
      }
    }
    return true;
  }

  save_svg() {
    let svgEl;
    svgEl = document.getElementById("example2");
    //svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    const svgData = svgEl.outerHTML;
    const preface = '<?xml version="1.0" standalone="no"?>\r\n';
    const svgBlob = new Blob([ preface,'<svg xmlns="http://www.w3.org/2000/svg" height="100" width="100">',
        svgData, '</svg>'], {type: "image/svg+xml;charset=utf-8"});
    let svgUrl = URL.createObjectURL(svgBlob);
    let downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "SVG_element";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  importSVG() {
    let fileInput = <HTMLInputElement>document.getElementById('c-upload-file');
    fileInput.click();
  }

  inputSVG() {
    let fileInput = <HTMLInputElement>document.getElementById('c-upload-file');
    let file = fileInput.files[0];
    let image = <HTMLImageElement>document.getElementById('output');
    image.src = URL.createObjectURL(file);
  }
}
