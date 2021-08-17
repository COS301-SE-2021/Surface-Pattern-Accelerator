import { Component, OnInit } from '@angular/core';
import {UploadService} from "../../services/upload.service";
import {HttpEventType, HttpResponse} from "@angular/common/http";
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';



@Component({
  selector: 'app-motif-upload',
  templateUrl: './motif-upload.component.html',
  styleUrls: ['./motif-upload.component.scss'],

})
export class MotifUploadComponent implements OnInit {
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message ='';
  formData: any;

  multiForm: FormGroup;
  urls = [];


  constructor(private uploadService: UploadService, private fb: FormBuilder, private httpClient: HttpClient) { }

  ngOnInit()
  {
    this.formData = new FormGroup({
      name: new FormControl(),
      files: new FormControl()
    })
    console.log("motif u")
    this.initForm();


  }



  selectFile(event: any)
  {
    console.log("File Selected");
    this.selectedFiles = event.target.files;
  }

  upload() {
    console.log("Upload")
    if (this.selectedFiles)
    {
      const file: File | null = this.selectedFiles.item(0);

      if (file)
      {
        this.currentFile = file;

        this.uploadService.upload(this.currentFile)
          .subscribe((event: any) => {
            if (event.type === HttpEventType.UploadProgress)
            {
                console.log("loaded: " + event.loaded)
              console.log("total: " + event.total)
            }
            else if (event instanceof HttpResponse)
            {
              this.message = event.body.message;
            }

          },(err: any) => {
            console.log(err);
            this.progress = 0;

            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }

            this.currentFile = undefined;

          })
      }
      this.selectedFiles = undefined;
    }
  }

  onClickSubmit(ev: any) {
    console.log(ev.target.files);
    console.log(this.formData.value)
  }

  onSubmit(values: any)
  {
    console.log(values);
  }

  initForm()
  {
    this.multiForm = this.fb.group({
      multiImages: this.fb.array([])
    })
  }

  createImage(img)
  {
    const newImage = new FormControl(img, Validators.required);
    (<FormArray>this.multiForm.get('multiImages')).push(newImage)
  }

  get multiImages(): FormArray
  {
    if (this.multiForm && this.multiForm.get('multiImages'))
    {
      return this.multiForm.get('multiImages') as FormArray;
    }
  }

  onFileUpload(event: any) {
    this.urls = [];
    let selectedFiles = event.target.files;
    console.log(selectedFiles)
    if (selectedFiles) {
      for (let file of selectedFiles) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.urls.push(e.target.result);
          this.createImage(e.target.result);
        }
        reader.readAsDataURL(file);
      }
    }
  }


  uploadFile(event: any) {
      const file = event.target.files[0];
      console.log(file)

    const formData = new FormData();
      formData.append('files', file)

      this.httpClient.post('http://localhost:3000/api/uploadMotif', formData, {withCredentials: true})
        .subscribe(response => {
          console.log(response)
        })
  }
}
