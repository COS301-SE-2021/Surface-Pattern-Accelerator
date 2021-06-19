import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-collor-pallet',
  templateUrl: './collor-pallet.component.html',
  styleUrls: ['./collor-pallet.component.scss'],
})
export class CollorPalletComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

  colorGen(){

    const code = document.querySelectorAll('.code');
    const color = document.querySelectorAll('.color');
    const letters = '0123456789abcdef';
    const hashtag = ['#','#','#','#','#','#'];
    var test: boolean;

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
      test = true;
    }
    return test;
  }

  lockColour(id: string){
    const elem = document.getElementById(id);
    let prev: HTMLElement;
    let next: HTMLElement;
    var testLock: boolean;
    var testChange: boolean;

    if(elem) {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      prev = <HTMLElement>elem.previousElementSibling;
      console.log('color div class: ' + prev.className);
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      next = <HTMLElement>elem.nextElementSibling;
      console.log('p class: ' + next.className);
      testChange = true;
    }

    if(prev.className === 'color'){
      prev.classList.remove('color');
      prev.classList.add('stay-color');
      prev.style.backgroundColor = next.innerHTML;
      console.log('prev.style.backgroundColor: ' + prev.style.backgroundColor);
      next.classList.remove('code');
      next.classList.add('new-code');
      elem.innerHTML = 'Unlock';
      testLock = true;
    }
    else if(prev.className === 'stay-color'){
      prev.classList.remove('stay-color');
      prev.classList.add('color');
      prev.style.backgroundColor = next.innerHTML;
      next.classList.remove('new-code');
      next.classList.add('code');
      elem.innerHTML = 'Lock';
      testLock = true;
    }

    return testChange === testLock;
  }


}