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
            clone.shouldDisplaySeamlessMod = motStateTemp.shouldDisplaySeamless;
            clone.nrOfArrayObjects = motStateTemp.nrOfArrayObjects;
            clone.ArrayModDirection = motStateTemp.ArrayModDirection;
            clone.ArrayModSpacing = motStateTemp.ArrayModSpacing;
            clone.arrayModifierElements = [];

            if (clone.shouldDisplaySeamlessMod)
            {
              this.addReflectionsToObject(clone,canvas)
            }

            for (let arrElem = 0; arrElem < clone.nrOfArrayObjects; arrElem++)
            {
              this.changeArrayModifierNumber(clone,1,clone.ArrayModSpacing,canvas, false)
            }
            this.updateArrModOfSelected(clone, canvas);




            canvas.add(clone) //the clone is put on the canvas


            //clone is pushed to motifsOnCanvas, used for layers and to have a reference of the motifs on canvas
            //this.motifsOnCanvas.objects.push({objectRef: clone, objectName: cachedMotTemp.motifName, objectID: cachedMotTemp.id, motifURL: cachedMotTemp.motifURL }); //TODO: create interface
            //console.log(this.motifsOnCanvas.objects[0].objectRef.left)
          })
        }
      }
    }
    this.motifsOnCanvas = this.getNonSpecialObjects(canvas);
    this.renderAllWithSpecial(this.motifsOnCanvas, canvas)
  }

  //deletes all data stored in this service to have it clean for the next collection
  purgeContent()
  {
    //this.motifs = {motifDetails: []} as motifsInterface;
    this.cachedMotifs = [];
    //this.motifsOnCanvas = {objects: []};
  }

  addReflectionsToObject(objectToAddTo: fabric.Object, canvas: fabric.Canvas)
  {
    //adds reflections to the specified object
    objectToAddTo.reflections = [
      this.reflectionCreator(objectToAddTo, -canvas.width, +canvas.height),
      this.reflectionCreator(objectToAddTo, -canvas.width, 0),
      this.reflectionCreator(objectToAddTo, -canvas.width, -canvas.height),
      this.reflectionCreator(objectToAddTo, 0, +canvas.height),
      this.reflectionCreator(objectToAddTo, 0, -canvas.height),
      this.reflectionCreator(objectToAddTo, +canvas.width, +canvas.height),
      this.reflectionCreator(objectToAddTo, +canvas.width, 0),
      this.reflectionCreator(objectToAddTo, +canvas.width, -canvas.height)
    ];
  }

  reflectionCreator(parent: fabric.Object, topOffset: number, leftOffset: number)
  {
    let tempReflection: fabric.Object;
    parent.clone((reflection) => {
      reflection.set('top', parent.top + topOffset);
      reflection.set('left', parent.left + leftOffset);
      reflection.set('selectable', false);
      reflection.set('evented', false);
      reflection.set('opacity', 1); //Opacity 1 is solid
      tempReflection = reflection;
    });
    return tempReflection;
  }

  changeArrayModifierNumber(parent: fabric.Object, num: number, distance: number, canvas: fabric.Canvas, updateNum: boolean = true) {
    //if the value is undefined, define it then add num to it
    if (!parent.nrOfArrayObjects)
    {
      parent.nrOfArrayObjects = 0;
      parent.arrayModifierElements = []; //initialize array
    }


    //makes so the nr of array modifier elements cant be negative
    if (!(parent.nrOfArrayObjects == 0 && num < 0))
    {
      if (updateNum)
      {
        parent.nrOfArrayObjects += num;
      }


      if (num > 0)
      {
        //if number is positive, add new clone
        const {y, x} = this.calculatePositionFromDirection(parent, distance, parent.nrOfArrayObjects);
        const tempObject = this.reflectionCreator(parent, y, x); //create the array modifier object with offset
        this.addReflectionsToObject(tempObject, canvas); //add reflections to array modifier object
        parent.arrayModifierElements.push(tempObject);
        console.log('Pushed new arr mod obj');
      }
      else
      {
        //if negative, pop object
        parent.arrayModifierElements.pop();
      }
      if (updateNum)
      {
        this.renderAllWithSpecial(this.getNonSpecialObjects(canvas), canvas);
      }
    }
  }

  //object index is the nth object in the parent objects array-modifier array
  calculatePositionFromDirection(parent: fabric.Object, distance: number, objIndex: number)
  {
    const tempDist = distance * objIndex;
    const tempSlideVal = this.toRadians( parent.ArrayModDirection - 180);
    const y = tempDist * Math.sin(tempSlideVal);
    const x = tempDist * Math.sin(1.5708 - tempSlideVal);
    return {y, x}; //return coordinates
  }

  toRadians(angle) {
    return angle * (Math.PI / 180);
  }

  updateArrModOfSelected(parent: fabric.Object, canvas: fabric.Canvas) {

    //console.log("update array mod")
    if (parent.nrOfArrayObjects)
    {
      for (let arrObj = 0; arrObj < parent.nrOfArrayObjects; arrObj++)
      {
        const {y, x} = this.calculatePositionFromDirection(parent, parent.ArrayModSpacing, arrObj + 1);
        this.arrayModUpdater(parent, arrObj,  y, x, canvas);
      }
    }
    //this.renderAllWithSpecial(this.getNonSpecialObjects());
    canvas.renderAll();

  }

  arrayModUpdater(parent: fabric.Object, arrayModIndex: number, topOffset: number, leftOffset: number, canvas: fabric.Canvas)
  {
    const ref = parent.arrayModifierElements[arrayModIndex];
    ref.set('top',  parent.top + topOffset);
    ref.set('left',  parent.left + leftOffset);
    ref.set('scaleX',  parent.scaleX);
    ref.set('scaleY',  parent.scaleY);
    ref.rotate( parent.angle);
    ref.set('flipX', parent.flipX);
    ref.set('flipY', parent.flipY);

    if (ref.reflections)
    {
      this.updateReflectionsOf(ref, canvas);
      console.log('Has reflections');
    }

  }

  updateReflectionsOf(obj: fabric.Object, canvas: fabric.Canvas) {
    if (obj.reflections != undefined && obj.reflections.length > 0)
    {
      this.reflectionUpdater(obj,0, -canvas.width, +canvas.height, this.updateReflectionsOf);
      this.reflectionUpdater(obj,1, -canvas.width, 0, this.updateReflectionsOf);
      this.reflectionUpdater(obj,2, -canvas.width, -canvas.height, this.updateReflectionsOf);
      this.reflectionUpdater(obj,3, 0, +canvas.height, this.updateReflectionsOf);
      this.reflectionUpdater(obj,4, 0, -canvas.height, this.updateReflectionsOf);
      this.reflectionUpdater(obj,5, +canvas.width, +canvas.height, this.updateReflectionsOf);
      this.reflectionUpdater(obj,6, +canvas.width, 0, this.updateReflectionsOf);
      this.reflectionUpdater(obj,7, +canvas.width, -canvas.height, this.updateReflectionsOf);
    }

  }

  reflectionUpdater(parentObj: fabric.Object, reflectionIndex: number, topOffset: number, leftOffset: number, callback)
  {
    const ref = parentObj.reflections[reflectionIndex];
    ref.set('top',  parentObj.top + topOffset);
    ref.set('left',  parentObj.left + leftOffset);
    ref.set('scaleX',  parentObj.scaleX);
    ref.set('scaleY',  parentObj.scaleY);
    ref.rotate( parentObj.angle);
    ref.set('flipX', parentObj.flipX);
    ref.set('flipY', parentObj.flipY);
  }

  renderAllWithSpecial(objects: fabric.Object[], canvas: fabric.Canvas)
  {
    const userObjects: fabric.Object[] = []; //all objects the user spawned in, not including reflections or arrayMod objects
    for (const obj in objects) //check to make sure no special objects are in this array
    {
      if (objects[obj].IDOnCanvas != undefined)
      {
        userObjects.push(objects[obj]);
      }
    }

    const objectsToRender: fabric.Object[] = [];
    for (const userObj in userObjects)
    {
      if (userObjects[userObj].IDOnCanvas > -1)
      {
        this.decideRenderOrder(userObjects[userObj], objectsToRender, userObjects[userObj].shouldDisplaySeamlessMod);
      }
    }
    canvas._objects = objectsToRender;
    canvas.renderAll();
  }

  decideRenderOrder(obj: fabric.Object, futureRenderObjects: fabric.Object[], shouldDisplaySeamless: Boolean)
  {

    if (shouldDisplaySeamless && obj.reflections != undefined)
    {
      // console.log('Pushed');
      //console.log(...obj.reflections)
      futureRenderObjects.push(...obj.reflections); //spread operator, pushes the reflection array to the objectsToRender array
    }
    futureRenderObjects.push(obj);

    if (obj.arrayModifierElements == undefined)
    {
      obj.arrayModifierElements = [];
    }
    for (let i = 0; i < obj.arrayModifierElements.length ; i++)
    {
      //console.log(obj.arrayModifierElements[i].reflections)
      this.decideRenderOrder(obj.arrayModifierElements[i], futureRenderObjects, shouldDisplaySeamless);
    }


  }

  getNonSpecialObjects(canvas: fabric.Canvas)
  {
    const tempAllObjects = canvas.getObjects();
    const nonSpecialObjects: fabric.Object[] = [];
    for (let i = 0; i < tempAllObjects.length; i++)
    {
      if (tempAllObjects[i].IDOnCanvas > -1)
      {
        nonSpecialObjects.push(tempAllObjects[i]);
      }
    }
    return nonSpecialObjects;
  }


}
