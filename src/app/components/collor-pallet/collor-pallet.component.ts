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

  }
}
