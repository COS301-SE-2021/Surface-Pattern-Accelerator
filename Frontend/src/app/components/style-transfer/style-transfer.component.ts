import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import * as  deepai from 'deepai';

@Component({
  selector: 'app-style-transfer',
  templateUrl: './style-transfer.component.html',
  styleUrls: ['./style-transfer.component.scss'],
})
export class StyleTransferComponent implements OnInit {

  styleImage: any;
  contentImage: any;
  generatedImage: any;
  styleBase64: string;
  constructor(private http: HttpClient) {
  }

  ngOnInit() {
  }

  async style(){

    // working
    deepai.setApiKey('c4fee479-a394-40ca-84d7-e166c67d520c');
    console.log('content' + document.getElementById('uploadedImage'));
    console.log('style' + document.getElementById('selectedStyle'));

    const resp = await deepai.callStandardApi('fast-style-transfer', {
      content: document.getElementById('readImg'),
      style: this.styleBase64,
    });
    console.log(resp);
    document.getElementById('generatedImg').setAttribute('src', resp.output_url);
  }

  /*
  * This function allows the user to upload and display their content image
  */
  upload(){
    const upload = document.getElementById('readImg') as HTMLInputElement;
    if(upload.files[0]){
      const reader = new FileReader();
      this.contentImage = new Image();

      reader.readAsDataURL(upload.files[0]);

      reader.addEventListener('load', (event) => {
        this.contentImage.src = event.target.result as string;

        console.log('contentImage: ' + this.contentImage.src);
        //display the image
        document.getElementById('uploadedImage').setAttribute('src', this.contentImage.src);
        document.getElementById('contentContainer').style.display = 'block';
        document.getElementById('uploadedImage').style.display = 'block';
      });
    }
  }

  /*
  * This function is used for the user to select a
  * style he/she would like to add to their uploaded image
  * */
  selectStyle(style: string, name: string) {
    if(style === 'style1.jpg') {
      // eslint-disable-next-line max-len
      this.styleBase64 = 'http://images.fineartamerica.com/images/artworkimages/mediumlarge/3/starry-night-print-by-vincent-van-gogh-vincent-van-gogh.jpg';
      document.getElementById('selectedStyle').setAttribute('src', this.styleBase64);
    }
    else{
      this.styleBase64 = 'http://afremov.com/images/product/image_938.jpeg';
      document.getElementById('selectedStyle').setAttribute('src', this.styleBase64);
    }
    this.styleImage = new Image();
    this.styleImage.setAttribute('src', '../../../assets/style-transfer/images/'+style);
    document.getElementById('stylesHeader').innerText = name+' selected';

    console.log('image' + style);
  }


  /*
  * This function checks if the images are set then it will
  * call style()
  *  */
  processGeneratedImage(){
    if(this.styleImage && this.contentImage){

      this.style().then();
      document.getElementById('contentContainer').style.display = 'none';
      document.getElementById('resultContainer').style.display = 'block';
      // window.alert('Running.... **add processing for backend**'); //remove this later
    }
    else if(!this.styleImage && this.contentImage){
      window.alert('Please pick a style');
    }
  }

  /**
   * This function is used to process image downloads
   */
  downloadImage(){

  }
}
