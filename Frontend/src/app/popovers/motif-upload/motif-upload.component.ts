import { Component, OnInit } from '@angular/core';
import {UploadService} from "../../services/upload.service";
import {HttpEventType, HttpResponse} from "@angular/common/http";
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import {LoadingController, PopoverController} from '@ionic/angular';
import {motif} from "../../Classes/motif.class";



@Component({
  selector: 'app-motif-upload',
  templateUrl: './motif-upload.component.html',
  styleUrls: ['./motif-upload.component.scss'],

})
export class MotifUploadComponent implements OnInit {
  files: any = [];
  fileNames: string[] = [];
  constructor( private popoverController: PopoverController,private uploadService: UploadService, private fb: FormBuilder, private httpClient: HttpClient, public loadingController: LoadingController) { }

  ngOnInit()
  {

  }

  previewImage(e) {
    let motifs = document.getElementsByClassName("uploadPreview");
    let length = (<HTMLInputElement>document.getElementById("uploadImage")).files.length;
    for (let i = 0; i < length; i++) {
      let oFReader = new FileReader();
      if (e.target)
        oFReader.readAsDataURL((<HTMLInputElement>document.getElementById("uploadImage")).files[i]);
        console.log(((<HTMLInputElement>document.getElementById("uploadImage")).files));

         oFReader.onload = function (oFREvent) {

        (<HTMLImageElement>motifs[i]).src = <string>oFREvent.target.result;
      };
    }
  }

  closePopover(){
    this.popoverController.dismiss();
  }


  selectFiles(event: any)
  {
    console.log("Files Selected");

    this.files = event.target.files;
    console.log(this.files);
    this.fileNames = []
    for (let file = 0; file < this.files.length; file++)
    {
      this.fileNames.push(this.files[file].name.split('.').shift())
    }
  }

  uploadFiles() {
    //this.files = event.target.files;
    console.log(this.files)

    if (this.files !== undefined)
    {
      const formData = new FormData();
      console.log("Length: " + this.files.length)
      for (let i = 0; i < this.files.length; i++)
      {
        console.log(this.files[i]);
        //TODO: append unique ID to file name so the server knows which files belong to which user
        formData.append('files', this.files[i], this.fileNames[i] + ".svg")
      }

      this.loadingController.create({
        message: "Uploading Files To Your Google Drive...",
      }).then(loaderResult => {
        loaderResult.present().then(() => {
          this.httpClient.post('http://localhost:3000/api/uploadMotif', formData, {withCredentials: true})
            .subscribe(response => {
              console.log(response)
              loaderResult.dismiss().then();
              this.closePopover();
            })
        })
      })
    }
  }
}
