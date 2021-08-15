import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-collor-pallet',
  templateUrl: './collor-pallet.component.html',
  styleUrls: ['./collor-pallet.component.scss'],
})
export class CollorPalletComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.colorGen();
  }

  getRandomIntInclusion(min, max) {
    const randomBuffer = new Uint32Array(1);

    window.crypto.getRandomValues(randomBuffer);

    let randomNumber = randomBuffer[0] / (0xffffffff + 1);

    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(randomNumber * (max - min + 1)) + min;
  }

  colorGen() {

    const code = document.querySelectorAll('.code');
    const color = document.querySelectorAll('.color');
    const letters = '0123456789abcdef';
    const hashtag = ['#','#','#','#','#','#'];

    for (let i=0;i<6;i++) {
      /*
      hashtag[i]+=letters[Math.floor(Math.random()*16)];
      hashtag[i]+=letters[Math.floor(Math.random()*16)];
      hashtag[i]+=letters[Math.floor(Math.random()*16)];
      hashtag[i]+=letters[Math.floor(Math.random()*16)];
      hashtag[i]+=letters[Math.floor(Math.random()*16)];
      hashtag[i]+=letters[Math.floor(Math.random()*16)];
       */
      hashtag[i]+=letters[Math.floor(this.getRandomIntInclusion(0, 16))];
      hashtag[i]+=letters[Math.floor(this.getRandomIntInclusion(0, 16))];
      hashtag[i]+=letters[Math.floor(this.getRandomIntInclusion(0, 16))];
      hashtag[i]+=letters[Math.floor(this.getRandomIntInclusion(0, 100)%16)];
      hashtag[i]+=letters[Math.floor(this.getRandomIntInclusion(0, 16))];
      hashtag[i]+=letters[Math.floor(this.getRandomIntInclusion(0, 16))];
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
