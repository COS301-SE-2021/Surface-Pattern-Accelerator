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

  changeColor() {
    let circle	= document.getElementById('example2');
    let circle2	= document.getElementById('example3');
    let colorPicker = <HTMLInputElement>document.getElementById('fav_color');
    let color	= colorPicker.value;
    circle.style.fill = color;
    circle2.style.fill = color;
    return true;
  }

  changeFill() {
    //**** this code section will be replaced by dynamic svg selection ****
    let svg	= document.getElementById('output');
    let colorPicker = <HTMLInputElement>document.getElementById('fav_color');

    //**** universal code ****
    let color	= colorPicker.value;

    //**** Searches through the svg and changes fill color for child nodes ****

    // An array of child nodes of the SVG
    let nodes = svg.children;
    // Iterating through the child nodes
    for (let k in nodes) {
      if (typeof nodes[k] != 'undefined') {
        console.log('Color component, changeFill(): ',nodes[k].tagName);
        if (nodes[k].hasAttribute('fill')) {
          nodes[k].setAttribute('fill', color);
        }
      }
    }
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
