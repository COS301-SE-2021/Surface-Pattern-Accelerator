import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { ICollectionsContent } from "../Interfaces/collectionContents.interface"
import { IPatternContentsInterface } from "../Interfaces/patternContents.interface"
import {LoadingController} from "@ionic/angular";


@Injectable({
  providedIn: 'root'
})
export class PatternService {
  private serverAPIURL = 'http://localhost:3000/api';

  patternContents: IPatternContentsInterface = {patternName: "", patternID: "", motifs: []} as IPatternContentsInterface;

  constructor(private http: HttpClient,
              public loadingController: LoadingController
              ) { }

  currentCollection?: ICollectionsContent;
  currentPattern?: IPatternContentsInterface;

  getCurrentCollectionJSON(fileID: string)
  {
    console.log("getCollectionJSON fired! fileID is: " + fileID);

    return this.http.post(this.serverAPIURL + '/getFileByID',
      { fileID: fileID },
      {withCredentials: true
      }).subscribe(fileContent => {
        console.log(fileContent);
        this.currentCollection = fileContent as ICollectionsContent;
        console.log(this.currentCollection);
        return fileContent;
    });
  }

  newPattern(patternName: string)
  {
      if (this.currentCollection !== null)
      {
        this.loadingController.create({
          message: "Creating Pattern..."
        }).then(loaderResult => {
          loaderResult.present().then(() => {
            this.currentCollection["childPatterns"].push({patternName: patternName, patternID: ""}); //add patterns name to collection, with empty ID

            let tempCurrentCollection: ICollectionsContent = this.currentCollection;

            this.http.post(this.serverAPIURL + '/createNewJSONFile',
              { patternFolderID: this.currentCollection["patternsFolderID"] },
              {withCredentials: true
              }).subscribe(res => {
              let newPatternDriveDetails: any = res; //newPatternDriveDetails.id is the reservation file ID that will be used to store the pattern in
              console.log(newPatternDriveDetails.id);

              for (let i = 0; i < this.currentCollection["childPatterns"].length; i++) //loop through all patterns belonging to this collection
              {
                console.log(this.currentCollection["childPatterns"][i])
                if (this.currentCollection["childPatterns"][i].patternID === "" ) //if a pattern does not have an ID
                {
                  this.currentCollection["childPatterns"][i].patternID = newPatternDriveDetails.id; //give it the ID of the reservation file
                  let tempPattern: IPatternContentsInterface = this.currentPattern = {patternName: patternName, patternID: newPatternDriveDetails.id,  motifs: []} as unknown as IPatternContentsInterface; //
                  this.http.post(this.serverAPIURL + '/updateFile', //send contents to reservation file
                    { fileID: this.currentCollection["childPatterns"][i].patternID, content: JSON.stringify(tempPattern), newName: patternName },
                    {withCredentials: true
                    }).subscribe(patternUpdateResult => {
                    console.log(patternUpdateResult) //prints

                    this.http.post(this.serverAPIURL + '/updateFile', //updates Collection File
                      { fileID: this.currentCollection["collectionID"], content: JSON.stringify(this.currentCollection) },
                      {withCredentials: true
                      }).subscribe(collectionUpdateResult => {
                      console.log(collectionUpdateResult) //prints
                      loaderResult.dismiss().then();
                    })
                  })
                }
              }
            })
          })
        })
        console.log(this.currentCollection);
      }
  }

}
