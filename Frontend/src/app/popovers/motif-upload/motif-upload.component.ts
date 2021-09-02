import { Component, OnInit } from '@angular/core';
import {UploadService} from "../../services/upload.service";
import {HttpEventType, HttpResponse} from "@angular/common/http";
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';



@Component({
  selector: 'app-motif-upload',
  templateUrl: './motif-upload.component.html',
  styleUrls: ['./motif-upload.component.scss'],

})
export class MotifUploadComponent implements OnInit {
  files: any = [];
  constructor(private uploadService: UploadService, private fb: FormBuilder, private httpClient: HttpClient, public loadingController: LoadingController) { }

  ngOnInit()
  {

  }



  selectFiles(event: any)
  {
    console.log("Files Selected");
    this.files = event.target.files;
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
        formData.append('files', this.files[i])
      }

      this.loadingController.create({
        message: "Uploading files..."
      }).then(loaderResult => {
        loaderResult.present().then(() => {
          this.httpClient.post('http://localhost:3000/api/uploadMotif', formData, {withCredentials: true})
            .subscribe(response => {
              console.log(response)
              loaderResult.dismiss().then();

              //refresh page?
              //location.reload()


            })
        })
      })


    }



  }
}
