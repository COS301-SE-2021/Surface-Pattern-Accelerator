import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { ICollectionsContent } from "../Interfaces/collectionContents.interface"
import { IPatternContentsInterface } from "../Interfaces/patternContents.interface"
import {LoadingController} from "@ionic/angular";
import {IMotifStateInterface} from "../Interfaces/motifDetails.interface";
import {MotifServiceService} from "./motif-service.service";
import {fabric} from "fabric";


@Injectable({
  providedIn: 'root'
})
export class PatternService {
  private serverAPIURL = 'http://localhost:3000/api';
  selectedPatternID?: string; //for default pattern selection in pattern dropdowns
  motifSaveStates: IMotifStateInterface[] = [];


  patternContents: IPatternContentsInterface = {patternName: "", patternID: "", motifs: []} as IPatternContentsInterface;

  constructor(private http: HttpClient,
              public loadingController: LoadingController,
              public motifService: MotifServiceService
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

  savePattern() {
    this.motifSaveStates = [];
    let tempMotifsOnCanvas = this.motifService.motifsOnCanvas.objects; //for performance, to have a local copy and not go to the service each time
    for (let mot in tempMotifsOnCanvas)
    {
      //this.motifsOnCanvas.objects[mot].objectRef.
      this.motifSaveStates.push({
        left: tempMotifsOnCanvas[mot].objectRef.left,
        top: tempMotifsOnCanvas[mot].objectRef.top,
        width: tempMotifsOnCanvas[mot].objectRef.getScaledWidth(),
        height: tempMotifsOnCanvas[mot].objectRef.getScaledHeight(),
        scale: tempMotifsOnCanvas[mot].objectRef.getObjectScaling(),
        rotation: tempMotifsOnCanvas[mot].objectRef.angle,
        layer: 0, //Temp
        motifID: tempMotifsOnCanvas[mot].objectID,
        motifName: tempMotifsOnCanvas[mot].objectName,

      })
    }
    this.patternContents.motifs = this.motifSaveStates;

    this.http.post(this.serverAPIURL + '/updateFile', //updates Collection File
      { fileID: this.patternContents.patternID, content: JSON.stringify(this.patternContents) },
      {withCredentials: true
      }).subscribe(patternUpdateResult => {
      console.log(patternUpdateResult) //prints
    })
    console.log(this.patternContents);
  }

  onPatternChange(selectedPatternID: any, canvas: fabric.Canvas) {
    console.log("on pattern change");
    canvas.clear();

    for (let motOnCanvas in this.motifService.motifsOnCanvas.objects)
    {
      canvas.remove(this.motifService.motifsOnCanvas.objects[motOnCanvas].objectRef)
    }

    this.http.post(this.serverAPIURL + '/getFileByID',
      { fileID: selectedPatternID },
      {withCredentials: true
      }).subscribe(fileContent => {
      this.patternContents = fileContent as IPatternContentsInterface;
      console.log(this.patternContents);
      this.motifService.spawnMotifObjectsFromSaveState(this.patternContents, canvas);
    });
  }


  checkIfPatternsExistAndSetDefault() { //default selection

    if (this.currentCollection)
    {
      if (!this.selectedPatternID)
      {
        this.selectedPatternID = this.currentCollection.childPatterns[0].patternID
      }

      return true
    }
    else
    {
      return false
    }
  }

}
