import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { ICollectionsContent } from "../Interfaces/collectionContents.interface"


@Injectable({
  providedIn: 'root'
})
export class PatternService {
  private serverAPIURL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  currentCollection?: ICollectionsContent;
  currentPattern?: any;

  getCurrentCollectionJSON(fileID: string)
  {
    console.log("getCollectionJSON fired! fileID is: " + fileID);

    return this.http.post(this.serverAPIURL + '/getFileByID',
      { fileID: fileID, },
      {withCredentials: true
      }).subscribe(fileContent => {
        console.log(fileContent);
        this.currentCollection = fileContent as ICollectionsContent;
        console.log(this.currentCollection);
        return fileContent;
    });
  }

  savePattern(patternName: string)
  {
      if (this.currentCollection !== null)
      {
        this.currentCollection["childPatterns"].push({patternName: "someName", patternID: "10001"});
        console.log(this.currentCollection);
      }
  }

}
