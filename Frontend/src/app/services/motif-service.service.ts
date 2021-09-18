import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {motifsInterface} from "../Interfaces/motifsInterface";
import {GLoginService} from "./g-login.service";
import {motif} from "../Classes/motif.class";
import {motifBodyInterface} from "../Interfaces/motifBodyInterface";
import {fabric} from 'fabric'
import {IPatternContentsInterface} from "../Interfaces/patternContents.interface";
import {PatternService} from "./pattern.service";
import {IMotifStateInterface} from "../Interfaces/motifDetails.interface";

@Injectable({
  providedIn: 'root'
})
export class MotifServiceService {

  private serverURL = 'http://localhost:3000';
  motifIndexIncValue: number = 0;
  //motifs?: motifsInterface;
  cachedMotifs: motif[] = []; //created at startup, clones are made of motif objects in this array and then added to canvas
  //motifsOnCanvas: {objects: {objectRef: fabric.Object, objectName: string, objectID: string, motifURL: string}[]} = {objects: []};
  motifsOnCanvas: fabric.Object[] = [];

  constructor(private http: HttpClient, private gLoginService: GLoginService) { }

  getMotifs(collectionMotifs: motifBodyInterface[])//: Observable< motifsInterface>
  {
    this.cachedMotifs = [];
    let cachePromiseArray: Promise<any>[] = [];
    return new Promise((accept, reject) => {
      console.log("get motifs fired!");

      console.log(collectionMotifs)
      for (let mot in collectionMotifs)
      {
        if(collectionMotifs.hasOwnProperty(mot))
        {
          //let svgPathPromise = this.getSVGPaths(this.motifs.motifDetails[mot]);
          this.cachedMotifs.push(new motif(collectionMotifs[mot].motifLink,collectionMotifs[mot].motifID, collectionMotifs[mot].motifName));
          let cachePromise = this.cachedMotifs[mot].cacheSVGInMemory();
          cachePromiseArray.push(cachePromise);
        }
      }
      Promise.all(cachePromiseArray)
        .then(() => {
          accept({text: "successfully fetched all motifs"});
        })

    })
  }

  // getMotifs()//: Observable< motifsInterface>
  // {
  //   let cachePromiseArray: Promise<any>[] = [];
  //   return new Promise((accept, reject) => {
  //     console.log("get motifs fired!");
  //     const getCollectionsURL = this.serverURL + '/api/getMotifs';
  //     this.http.get<motifsInterface>(getCollectionsURL, {withCredentials: true})
  //       .subscribe(motifs =>
  //       {
  //         this.motifs = motifs
  //         for (let mot in this.motifs.motifDetails)
  //         {
  //           if(motifs.motifDetails.hasOwnProperty(mot))
  //           {
  //             //let svgPathPromise = this.getSVGPaths(this.motifs.motifDetails[mot]);
  //             this.cachedMotifs.push(new motif(this.motifs.motifDetails[mot].motifLink,this.motifs.motifDetails[mot].motifID, this.motifs.motifDetails[mot].motifName));
  //             let cachePromise = this.cachedMotifs[mot].cacheSVGInMemory();
  //             cachePromiseArray.push(cachePromise);
  //           }
  //         }
  //         Promise.all(cachePromiseArray)
  //           .then(() => {
  //             accept({text: "successfully fetched all motifs"});
  //           })
  //       });
  //   })
  // }

  //gets all motifs for motif library
  getAllMotifs()
  {

      console.log("get all motifs fired!");
      const getCollectionsURL = this.serverURL + '/api/getMotifs';
      return this.http.get<motifsInterface>(getCollectionsURL, {withCredentials: true})

  }


  spawnMotifObject(motifObject: motif, canvas: fabric.Canvas, isSeamless: Boolean = false, arrayModElements: number = 0, arrayModSpacing: number = 200, arrayModDirection: number = 0)
  {
    if (motifObject) //check if object exists
    {
      let objectToSpawn = motifObject.obj;
      console.log(motifObject.obj.googleDriveID)
      objectToSpawn.scaleToHeight(canvas.height-250) //this is relative? Keep same in both spawn functions******
        .set({left: canvas.width/15, top: canvas.height/15})
        .setCoords();
      console.log("Spawn Motif Path")
      //TODO: create factory function
      objectToSpawn.clone( (clone: fabric.Object) => { //objectToSpawn is the cached svg in memory. Make clones of this object and then

        clone.googleDriveID = motifObject.id;
        clone.IDOnCanvas = this.motifIndexIncValue++;
        clone.motifURL = motifObject.motifURL;
        clone.motifName = motifObject.motifName;

        //give array mod spacing a default value if it has not been initialized
        clone.ArrayModSpacing = arrayModSpacing;
        clone.ArrayModDirection = arrayModDirection;
        clone.shouldDisplaySeamlessMod = isSeamless;

        //TODO: should display array modifier
        //clone.shouldDisplayArrayMod


        this.motifsOnCanvas.push(clone); //used for layers
        canvas.add(clone).renderAll(); //the clone is spawned on the canvas

      })
    }
  }

  spawnMotifObjectsFromSaveState(patternContents: IPatternContentsInterface, canvas: fabric.Canvas)
  {
    //this.motifsOnCanvas = {objects: []}; //clears motifs on canvas
    if(!patternContents)
    {
      return;
    }
    for (let motState in patternContents.motifs) //the json file of the pattern contents gotten from the server
    {
      let motStateTemp = patternContents.motifs[motState] //temp value, store as its potentially accessed a lot - for performance
      for (let cachedMot in this.cachedMotifs) //array of cached motifs, "the library" to select from
      {
        let cachedMotTemp = this.cachedMotifs[cachedMot] //store reference to cached motif, less cluttered
        if (motStateTemp.motifID === cachedMotTemp.id) //if if in cached motifs match motif ID in pattern JSON then spawn than motif
        {
          let objectToSpawn = cachedMotTemp.obj;

          objectToSpawn.clone( (clone: fabric.Object) => { //objectToSpawn is the cached svg in memory. Make clones of this object and then
            clone
              .set({
                left: motStateTemp.left,
                top: motStateTemp.top,
                angle: motStateTemp.rotation,
                //height: motStateTemp.height* motStateTemp.scale.scaleY,
                //width: motStateTemp.width* motStateTemp.scale.scaleX
                scaleX: motStateTemp.scale.scaleX,
                scaleY: motStateTemp.scale.scaleY,
              })
              .setCoords()
            clone.googleDriveID = motStateTemp.motifID;
            clone.IDOnCanvas = this.motifIndexIncValue++;
            clone.motifURL = motStateTemp.motifURL;
            clone.motifName = motStateTemp.motifName;
            canvas.add(clone).renderAll(); //the clone is spawned on the canvas


            //clone is pushed to motifsOnCanvas, used for layers and to have a reference of the motifs on canvas
            //this.motifsOnCanvas.objects.push({objectRef: clone, objectName: cachedMotTemp.motifName, objectID: cachedMotTemp.id, motifURL: cachedMotTemp.motifURL }); //TODO: create interface
            //console.log(this.motifsOnCanvas.objects[0].objectRef.left)
          })
        }
      }
    }
    this.motifsOnCanvas = canvas.getObjects();
  }

  //deletes all data stored in this service to have it clean for the next collection
  purgeContent()
  {
    //this.motifs = {motifDetails: []} as motifsInterface;
    this.cachedMotifs = [];
    //this.motifsOnCanvas = {objects: []};
  }


}
