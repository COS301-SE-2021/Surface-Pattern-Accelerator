import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PatternService {
  private serverAPIURL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }


  getCurrentCollectionJSON(fileID: string)
  {
    console.log("getCollectionJSON fired! fileID is: " + fileID);

    return this.http.post(this.serverAPIURL + '/getFileByID',
      { fileID: fileID, },
      {withCredentials: true
      }).subscribe(fileContent => {
        console.log(fileContent);
        return fileContent;
    });
  }


}
