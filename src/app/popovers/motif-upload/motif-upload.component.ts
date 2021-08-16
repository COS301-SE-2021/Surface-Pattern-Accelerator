import { Component, OnInit } from '@angular/core';
import {UploadService} from "../../services/upload.service";
import {HttpEventType, HttpResponse} from "@angular/common/http";

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

  constructor(private uploadService: UploadService) { }

  ngOnInit() {}

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
}
