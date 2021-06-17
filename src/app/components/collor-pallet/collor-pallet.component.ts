import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-collor-pallet',
  templateUrl: './collor-pallet.component.html',
  styleUrls: ['./collor-pallet.component.scss'],
})
export class CollorPalletComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

  colorGen() {
    const code = document.querySelectorAll('.code');

    const color = document.querySelectorAll('.color');

    const letters = '0123456789abcdef';

    const hashtag = ['#', '#', '#', '#', '#', '#'];
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
    
  }

  
}
