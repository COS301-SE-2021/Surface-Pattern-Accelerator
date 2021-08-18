import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private baseURL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  upload(file: File)
  {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', this.baseURL + '/uploadMotif', formData,
      {
        reportProgress: true,
        responseType: "json"
      });

    return this.http.request(req);

  }

}
