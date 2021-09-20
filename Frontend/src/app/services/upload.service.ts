import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs'
import {ServerLinkService} from "./server-link.service";

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  //private baseURL = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private serverLink: ServerLinkService) { }

  upload(file: File)
  {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', this.serverLink.getServerLink() + '/api/uploadMotif', formData,
      {
        reportProgress: true,
        responseType: "json"
      });

    return this.http.request(req);

  }

  ////////////////////////delete
  payment()
  {
    const req = new HttpRequest('POST', this.serverLink.getServerLink() + '/api/create-checkout-session',
      {
        reportProgress: true,
        responseType: "json"
      });

    return this.http.request(req);

  }

}
