import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {motifsInterface} from "../Interfaces/motifsInterface";
import {GLoginService} from "./g-login.service";
import {motif} from "../Classes/motif.class";
import {motifBodyInterface} from "../Interfaces/motifBodyInterface";
import {fabric} from "fabric";
import {IPatternContentsInterface} from "../Interfaces/patternContents.interface";

@Injectable({
  providedIn: 'root'
})
export class MotifServiceService {

  private serverURL = 'http://localhost:3000';
  motifs?: motifsInterface;
  cachedMotifs: motif[] = [];
  motifsOnCanvas: {objects: {objectRef: fabric.Object, objectName: string, objectID: string, motifURL: string}[]} = {objects: []};

  constructor(private http: HttpClient, private gLoginService: GLoginService) { }

  getMotifs()//: Observable< motifsInterface>
  {
    let cachePromiseArray: Promise<any>[] = [];
    return new Promise((accept, reject) => {
      console.log("get motifs fired!");
      const getCollectionsURL = this.serverURL + '/api/getMotifs';
      this.http.get<motifsInterface>(getCollectionsURL, {withCredentials: true})
        .subscribe(motifs =>
        {
          this.motifs = motifs
          for (let mot in this.motifs.motifDetails)
          {
            if(motifs.motifDetails.hasOwnProperty(mot))
            {
              //let svgPathPromise = this.getSVGPaths(this.motifs.motifDetails[mot]);
              this.cachedMotifs.push(new motif(this.motifs.motifDetails[mot].motifLink,this.motifs.motifDetails[mot].motifID, this.motifs.motifDetails[mot].motifName));
              let cachePromise = this.cachedMotifs[mot].cacheSVGInMemory();
              cachePromiseArray.push(cachePromise);
            }
          }
          Promise.all(cachePromiseArray)
            .then(() => {
              accept({text: "successfully fetched all motifs"});
            })
        });
    })

  }

  spawnMotifObject(motifObject: motif, canvas: fabric.Canvas)
  {
    if (motifObject.obj) //check if object exists
    {
      let objectToSpawn = motifObject.obj;
      objectToSpawn.scaleToHeight(canvas.height-250) //this is relative? Keep same in both spawn functions******
        .set({left: canvas.width/15, top: canvas.height/15})
        .setCoords();
      console.log("Spawn Motif Path")
      objectToSpawn.clone( (clone: fabric.Object) => { //objectToSpawn is the cached svg in memory. Make clones of this object and then
        canvas.add(clone).renderAll(); //the clone is spawned on the canvas
        this.motifsOnCanvas.objects.push({objectRef: clone, objectName: motifObject.motifName, objectID: motifObject.id, motifURL: motifObject.motifURL}); //TODO: create interface
        //console.log(this.motifsOnCanvas.objects[0].objectRef.left)
      })
    }
  }

  spawnMotifObjectsFromSaveState(patternContents: IPatternContentsInterface, canvas: fabric.Canvas)
  {
    this.motifsOnCanvas = {objects: []}; //clears motifs on canvas
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
            canvas.add(clone).renderAll(); //the clone is spawned on the canvas

            //clone is pushed to motifsOnCanvas, used for layers and to have a reference of the motifs on canvas
            this.motifsOnCanvas.objects.push({objectRef: clone, objectName: cachedMotTemp.motifName, objectID: cachedMotTemp.id, motifURL: cachedMotTemp.motifURL }); //TODO: create interface
            //console.log(this.motifsOnCanvas.objects[0].objectRef.left)
          })
        }
      }
    }
  }




}
