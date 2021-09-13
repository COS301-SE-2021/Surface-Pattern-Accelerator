import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-style-transfer',
  templateUrl: './style-transfer.component.html',
  styleUrls: ['./style-transfer.component.scss'],
})
export class StyleTransferComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

  upload(){
    const upload = document.getElementById('readImg') as HTMLInputElement;
    if(upload.files[0]){
      const image = new FileReader();

      image.readAsDataURL(upload.files[0]);

      image.addEventListener('load', (event) => {

        document.getElementById('uploadedImage').setAttribute('src', event.target.result.toString());

        document.getElementById('uploadedImage').style.display = 'block';
      });
    }
  }

}
