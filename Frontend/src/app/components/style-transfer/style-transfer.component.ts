import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-style-transfer',
  templateUrl: './style-transfer.component.html',
  styleUrls: ['./style-transfer.component.scss'],
})
export class StyleTransferComponent implements OnInit {

  styleImage: any;
  contentImage: any;
  generatedImage: any;
  constructor() { }

  ngOnInit() {}

  /*
  * This function allows the user to upload and display their content image
  */
  upload(){
    const upload = document.getElementById('readImg') as HTMLInputElement;
    if(upload.files[0]){
      const image = new FileReader();
      this.contentImage = new Image();
      image.readAsDataURL(upload.files[0]);

      image.addEventListener('load', (event) => {
        const source: string = event.target.result.toString();
        this.contentImage.setAttribute('src', source);

        //display the image
        document.getElementById('uploadedImage').setAttribute('src', source);
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
    this.styleImage = new Image();
    this.styleImage.setAttribute('src', '../../../assets/style-transfer/images/'+style);
    document.getElementById('stylesHeader').innerText = name+' selected';
  }


  /*
  * This function checks if the images are set then it will
  *  send the images to a folder in the backend with the py file
  *  */
  processGeneratedImage(){
    if(this.styleImage && this.contentImage){
      // 1. pass the style and content image as parameters in the server request
      // 2. save the images as style.jpg and content.jpg respectively, in the folder with the python file
      // 3. call python function (which generates the generated.png in the same directory as the py file)
      // 4. get the generated image (generated.png) from the folder (backend) and assign it to this.generatedImage (frontend)

      // When the image is saved in this.generatedImage execute the block of code bellow
      // this.generatedImage = -----------;
      // document.getElementById('contentContainer').style.display = 'none';
      // document.getElementById('resultContainer').style.display = 'block';
      // document.getElementById('generatedImg').setAttribute('src', this.styleImage.src);
      // window.alert('Running.... **add processing for backend**'); //remove this later
    }
    else if(!this.styleImage && this.contentImage){
      window.alert('Please pick a style');
    }
  }

}
