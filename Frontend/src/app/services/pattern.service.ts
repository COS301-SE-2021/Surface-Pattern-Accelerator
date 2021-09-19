/* eslint-disable max-len,@typescript-eslint/prefer-for-of */
import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { ICollectionsContent } from '../Interfaces/collectionContents.interface';
import { IPatternContentsInterface } from '../Interfaces/patternContents.interface';
import {LoadingController} from '@ionic/angular';
import {IMotifStateInterface} from '../Interfaces/motifDetails.interface';
import {MotifServiceService} from './motif-service.service';
import {fabric} from 'fabric';



@Injectable({
  providedIn: 'root'
})
export class PatternService {
  serverAPIURL = 'http://localhost:3000/api';

  selectedPatternID?: string; //for default pattern selection in pattern dropdowns
  motifSaveStates: IMotifStateInterface[] = [];


  patternContents: IPatternContentsInterface = {patternName: '', patternID: '', motifs: []} as IPatternContentsInterface;

  currentCollection?: ICollectionsContent;
  //currentPattern?: IPatternContentsInterface;

  constructor(private http: HttpClient,
              public loadingController: LoadingController,
              public motifService: MotifServiceService
              ) { }



  getCurrentCollectionJSON(fileID: string)
  {

    return new Promise((accept, reject) => {
      console.log('getCollectionJSON fired! fileID is: ' + fileID);

      this.http.post(this.serverAPIURL + '/getFileByID',
        { fileID },
        {withCredentials: true
        }).subscribe(fileContent => {
        console.log(fileContent);
        this.currentCollection = fileContent as ICollectionsContent;
        console.log(this.currentCollection);
        this.motifService.getMotifs(this.currentCollection.childMotifs)
          .then(() => {
            console.log('All motifs loaded');
            accept(fileContent as ICollectionsContent);
          });

      });
    })

  }

  newPattern(patternName: string)
  {
      if (this.currentCollection !== null)
      {
        this.loadingController.create({
          message: 'Creating Pattern...'
        }).then(loaderResult => {
          loaderResult.present().then(() => {
            this.currentCollection.childPatterns.push({patternName, patternID: ''}); //add patterns name to collection, with empty ID

            const tempCurrentCollection: ICollectionsContent = this.currentCollection;

            this.http.post(this.serverAPIURL + '/createNewJSONFile',
              { patternFolderID: this.currentCollection.patternsFolderID },
              {withCredentials: true
              }).subscribe(res => {
              // eslint-disable-next-line max-len
              const newPatternDriveDetails: any = res; //newPatternDriveDetails.id is the reservation file ID that will be used to store the pattern in
              console.log(newPatternDriveDetails.id);


              for (let i = 0; i < this.currentCollection.childPatterns.length; i++) //loop through all patterns belonging to this collection
              {
                console.log(this.currentCollection.childPatterns[i]);
                if (this.currentCollection.childPatterns[i].patternID === '' ) //if a pattern does not have an ID
                {
                  this.currentCollection.childPatterns[i].patternID = newPatternDriveDetails.id; //give it the ID of the reservation file


                  const tempPattern: IPatternContentsInterface = this.patternContents = {patternName, patternID: newPatternDriveDetails.id,  motifs: []} as unknown as IPatternContentsInterface; //
                  this.http.post(this.serverAPIURL + '/updateFile', //send contents to reservation file


                    { fileID: this.currentCollection.childPatterns[i].patternID, content: JSON.stringify(tempPattern), newName: patternName },
                    {withCredentials: true
                    }).subscribe(patternUpdateResult => {
                    console.log(patternUpdateResult); //prints

                    this.http.post(this.serverAPIURL + '/updateFile', //updates Collection File
                      { fileID: this.currentCollection.collectionID, content: JSON.stringify(this.currentCollection) },
                      {withCredentials: true
                      }).subscribe(collectionUpdateResult => {
                      console.log(collectionUpdateResult); //prints
                      this.selectedPatternID = newPatternDriveDetails.id;
                      loaderResult.dismiss().then();
                    });
                  });
                }
              }
            });
          });
        });
        console.log(this.currentCollection);
      }
  }

  updateCurrentCollection()
  {
    this.http.post(this.serverAPIURL + '/updateFile', //updates Collection File
      { fileID: this.currentCollection.collectionID, content: JSON.stringify(this.currentCollection) },
      {withCredentials: true
      }).subscribe(collectionUpdateResult => {
      console.log(collectionUpdateResult); //prints
    });
  }

  dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], {type: mimeString});


  }

  savePattern(patternCanvas: fabric.Canvas, collectionID: string) {

    //Upload thumbnail part
    // try {
    //   const formData = new FormData();
    //   //TODO: append unique ID to file name so the server knows which files belong to which user
    //   formData.append('files', this.dataURItoBlob(patternCanvas.toDataURL()), 'testName' + '.png');
    //   this.http.post('http://localhost:3000/api/savePattern', formData, {withCredentials: true})
    //     .subscribe(response => {
    //       console.log(response);
    //     });
    // }
    // catch (err)
    // {
    //   console.log(err);
    // }
    /////////////////////

    //TODO: new pattern saving

    this.motifSaveStates = [];
    const tempMotifsOnCanvas = this.motifService.motifsOnCanvas; //for performance, to have a local copy and not go to the service each time
    // eslint-disable-next-line guard-for-in
    for (const mot in tempMotifsOnCanvas)
    {
      //this.motifsOnCanvas.objects[mot].objectRef.
      this.motifSaveStates.push({
        left: tempMotifsOnCanvas[mot].left,
        top: tempMotifsOnCanvas[mot].top,
        width: tempMotifsOnCanvas[mot].getScaledWidth(),
        height: tempMotifsOnCanvas[mot].getScaledHeight(),
        scale: tempMotifsOnCanvas[mot].getObjectScaling(),
        rotation: tempMotifsOnCanvas[mot].angle,
        layer: 0, //Temp
        motifID: tempMotifsOnCanvas[mot].googleDriveID,
        motifName: tempMotifsOnCanvas[mot].motifName,
        motifURL: tempMotifsOnCanvas[mot].motifURL,
        shouldDisplaySeamless: tempMotifsOnCanvas[mot].shouldDisplaySeamlessMod,
        nrOfArrayObjects: tempMotifsOnCanvas[mot].nrOfArrayObjects,
        ArrayModDirection: tempMotifsOnCanvas[mot].ArrayModDirection,
        ArrayModSpacing: tempMotifsOnCanvas[mot].ArrayModSpacing



      });
    }
    console.log('Contents are:');
    console.log(this.patternContents);
    this.patternContents.motifs = this.motifSaveStates;

    // this.http.post(this.serverAPIURL + '/updateFile', //updates Collection File
    //   { fileID: this.patternContents.patternID, content: JSON.stringify(this.patternContents) },
    //   {withCredentials: true
    //   }).subscribe(patternUpdateResult => {
    //   console.log(patternUpdateResult); //prints
    //   alert('Pattern Frame Saved Successfully');
    // });

    try {
      this.loadingController.create({
        message: "Saving Your Pattern..."
      }).then(loaderResult => {
        loaderResult.present().then(r => {
          const formData = new FormData();
          //TODO: append unique ID to file name so the server knows which files belong to which user
          formData.append('files', this.dataURItoBlob(patternCanvas.toDataURL()), 'testName' + '.png');
          formData.append('patternID', this.patternContents.patternID);
          formData.append('patternContent', JSON.stringify(this.patternContents));
          formData.append('collectionID', collectionID);
          this.http.post('http://localhost:3000/api/savePattern',
            formData,
            {withCredentials: true})
            .subscribe(response => {
              console.log(response);
              loaderResult.dismiss().then();
            });
        })
      })



    }
    catch (err)
    {
      console.log(err);
    }

    console.log(this.patternContents);
  }

  getAndLoadSavedPattern(selectedPatternID: any, canvas: fabric.Canvas) {
    console.log('on pattern change');
    canvas.clear();

    this.loadingController.create({
      message: "Loading Pattern..."
    }).then(loaderResult => {
      loaderResult.present().then(r => {


        this.http.post(this.serverAPIURL + '/getFileByID',
          { fileID: selectedPatternID },
          {withCredentials: true
          }).subscribe(fileContent => {
          if (fileContent)
          {
            this.patternContents = fileContent as IPatternContentsInterface;
            console.log(this.patternContents);
            this.motifService.spawnMotifObjectsFromSaveState(this.patternContents, canvas);

          }
          loaderResult.dismiss().then()

        });

      })
    })

    // for (let motOnCanvas in this.motifService.motifsOnCanvas.objects)
    // {
    //   canvas.remove(this.motifService.motifsOnCanvas.objects[motOnCanvas].objectRef)
    // }



  }


  checkIfPatternsExistAndSetDefault() { //default selection

    try {
      if (this.currentCollection)
      {
        if (!this.selectedPatternID && this.currentCollection.childPatterns)
        {
          this.selectedPatternID = this.currentCollection.childPatterns[0].patternID;
        }

        return true;
      }
      else
      {
        return false;
      }
    }
    catch (error)
    {
      return false;
    }

  }

  purgeContent()
  {
    this.selectedPatternID = undefined;
    this.motifSaveStates = [];


    //this.patternContents = {patternName: "", patternID: "", motifs: []} as IPatternContentsInterface;

    this.currentCollection = {} as ICollectionsContent;
    //this.currentPattern = {} as IPatternContentsInterface;
  }

}
