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
    this.colorGen();
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

  colorGen(){

    const code = document.querySelectorAll('.code');
    const color = document.querySelectorAll('.color');
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

    for (let i=0;i<code.length;i++){

      code[i].innerHTML = hashtag[i];

      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const c = <HTMLElement> color[i];
      c.style.backgroundColor = hashtag[i];
    }
  }

  lockColour(id: string){
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

    if(prev.className === 'color'){
      prev.classList.remove('color');
      prev.classList.add('stay-color');
      prev.style.backgroundColor = next.innerHTML;
      console.log('prev.style.backgroundColor: ' + prev.style.backgroundColor);
      next.classList.remove('code');
      next.classList.add('new-code');
      elem.innerHTML = 'Unlock';
    }
    else if(prev.className === 'stay-color'){
      prev.classList.remove('stay-color');
      prev.classList.add('color');
      prev.style.backgroundColor = next.innerHTML;
      next.classList.remove('new-code');
      next.classList.add('code');
      elem.innerHTML = 'Lock';
    }

  }
}
