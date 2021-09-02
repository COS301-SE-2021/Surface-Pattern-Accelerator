import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MotifServiceService } from '../../services/motif-service.service';

import { Group } from 'konva/lib/Group';
import { Shape, ShapeConfig } from 'konva/lib/Shape';
import {motifsInterface} from "../../Interfaces/motifsInterface";
import { PatternService } from "../../services/pattern.service";
import {MotifCatalogueComponent} from "../../popovers/motif-catalogue/motif-catalogue.component"
import {MotifUploadComponent} from "../../popovers/motif-upload/motif-upload.component"
import {IPatternContentsInterface} from "../../Interfaces/patternContents.interface"
import {HttpClient} from "@angular/common/http";
import {fabric} from "fabric";



import { ActivatedRoute } from '@angular/router';
import {IMotifStateInterface} from "../../Interfaces/motifDetails.interface"
import {PopoverController} from "@ionic/angular";
import {ICollectionsContent} from "../../Interfaces/collectionContents.interface";
import {NewPatternComponent} from "../../popovers/new-pattern/new-pattern.component"

import {motif} from "../../Classes/motif.class"
import Konva from "konva";
import pixelRatio = Konva.pixelRatio;


@Component({
  selector: 'app-pattern',
  templateUrl: './pattern.component.html',
  styleUrls: ['./pattern.component.scss'],
})
export class PatternComponent implements OnInit {

  ///search
  items = [{ name: "archie" }, { name: "jake" }, { name: "richard" }];
  values = [];
  searchableMotifs=[]

  canvasWidth: number = 600;
  canvasHeight: number = 600;


  @ViewChild("parent") private parentRef: ElementRef<HTMLElement>;
  activeObject: fabric.Object;

  onKey(event: any) {
    const query = event.target.value.toLowerCase();
    const p = document.querySelector('p.testing');
    console.log(query)
    console.table(this.searchableMotifs)
    var doc = document.getElementById("testing");
    var arrs =Array.from(this.parentRef.nativeElement.children as HTMLCollectionOf<HTMLElement>)
    console.log(arrs.length)
    requestAnimationFrame(() => {
        arrs.forEach(async item => {
        const shouldShow =await item.textContent.toLowerCase().indexOf(query) > -1;
        item.style.display = shouldShow ? 'block' : 'none';
      })
    });
  }

  /////////////////////
  private serverAPIURL = 'http://localhost:3000/api';
  selected!:(Group | Shape);
  selectedPattern: any;
  //motifs?: motifsInterface;

  canvas?: fabric.Canvas;
  canvasPre?: fabric.Canvas;
  img?: fabric.Image;
  motifSaveStates: IMotifStateInterface[] = [];
  motifsOnCanvas: {objects: {objectRef: fabric.Object, objectName: string, objectID: string, motifURL: string}[]} = {objects: []};
  motifObjects: motif[] = [];
  canvasMotifs: fabric.Object[] = [];
  seamlessClones: fabric.Object[] = [];
  motifCount: number = 0;
  scale: number = 3;
  _state: fabric.Object[][];
  width: number = 600;
  height: number = 600;
  undoLimit: number = 20;
  pixel: number = 2;
  opacity: number = 1;
  color: string = "white";
  colorOrginal: string = "white";
  background: boolean = false;
  ptn: boolean = false;

  downWidth: number = null;
  downHeight: number = null;

  directionSliderValue: number = 0;
  distBetweenArrayModElements: number = 200;


  pcan = (<HTMLInputElement>document.getElementById("imgPreview"));//canvas preview

  //saving patterns in pattern Contents interface
  patternContents: IPatternContentsInterface = {patternName: "", patternID: "", motifs: []} as IPatternContentsInterface;



  constructor(public motifService: MotifServiceService,
              private route: ActivatedRoute,
              public patternService: PatternService,
              private popoverController: PopoverController,
              private http: HttpClient) {}


  ngOnInit(){

    //gets the requested Collections ID in the path
    this.route.params.subscribe(params => {
      this.patternService.getCurrentCollectionJSON(params['collectionID']);
      //this.getMotifs();
    })


    this.canvas = new fabric.Canvas('patternFrame', { preserveObjectStacking: true });
    this.canvas.setHeight(this.width);
    this.canvas.setWidth(this.height);
    this.canvas.backgroundColor = null;
    this._state = new Array<Array<fabric.Object>>(this.undoLimit);
    this._state = [];

    this.canvas.on("selection:created",(r) => {
      this.getSelectedObject();
    })

    this.canvas.on("selection:updated",(r) => {
      this.getSelectedObject();
    })

    this.canvas.on("object:moving" ,(r) => {
      if (this.activeObject.shouldDisplaySeamlessMod)
      {
        this.updateReflectionsOf(this.activeObject)

        console.log("Moving Reflections")
      }
      this.updateArrModOfSelected();
    })

    this.canvas.on("object:rotating" ,(r) => {
      if (this.activeObject.shouldDisplaySeamlessMod)
      {
        this.updateReflectionsOf(this.activeObject)

        console.log("Moving Reflections")
      }
      this.updateArrModOfSelected()
    })

    this.canvas.on("object:scaling" ,(r) => {
      if (this.activeObject.shouldDisplaySeamlessMod)
      {
        this.updateReflectionsOf(this.activeObject)

        console.log("Moving Reflections")
      }
      this.updateArrModOfSelected();
    })

    this.canvas.on("object:rotated" ,(r) => {
      this.addState();
    })

    this.canvas.on("object:scaled" ,(r) => {
      this.addState();
    })

    this.canvas.on("object:removed" ,(r) => {
      this.addState();
    })

    this.canvas.on("object:moved" ,(r) => {
      this.addState();
      console.log(this._state);
    })

    //this.frame = document.getElementById('patternFrame');//get div of workarea

    // this.canvasPre = new fabric.Canvas('previewFrame', { preserveObjectStacking: true });
    // this.canvasPre.setHeight(this.width);
    // this.canvasPre.setWidth(this.height);
    // this.canvasPre.backgroundColor = null;
    //
    // this.img = new fabric.Image('previewFrame');

  }

  addState()
  {
      let state : fabric.Object[] = [];
      let motifs = this.getNonSpecialObjects();
      for( let i = 0 ; i < this.getNonSpecialObjects().length ; i++ ){
        motifs[i].clone((clone)=>{
          clone.googleDriveID =  motifs[i].googleDriveID;
          clone.motifURL =  motifs[i].motifURL;
          clone.motifName =  motifs[i].motifName;
          clone.IDOnCanvas = motifs[i].IDOnCanvas;
          clone.hasReflections = false;
          state.push(clone);
        })
      }
      this._state.unshift(state);
      if(this._state.length > 20)
        this._state.pop();
  }

  undo()
  {
    if(this._state.length == 0) return;
    else {
      const state = [...(this._state.shift())];
      console.log(state);
      this.motifService.motifsOnCanvas = state;
      this.canvas.clear();
      this.canvas._objects = [];
      for(let i = 0 ; i < state.length ; i++){
        this.canvas.add(state[i]);
      }
      this.renderAllWithSpecial(state);
    }
  }

  emptyState()
  {
    this._state = [];
  }

  collectionCataloguePopover()
  {
    this.popoverController.create({
      component: MotifCatalogueComponent,
      translucent: true,
      cssClass: 'fullscreen'
    }).then(resPop => {
      resPop.present().then(presentRes => {
        return presentRes;
      });
    })
  }

  uploadFilePopover()
  {
    this.popoverController.create({
      component: MotifUploadComponent,
      translucent: true,
      cssClass: 'fullscreen'
    }).then(resPop => {
      resPop.present().then(presentRes => {
        return presentRes;

      });
    })
  }

  getMotifs(): void
  {
    // this.motifService.getMotifs(this.patternContents.motifs)
    //   .then((motifs ) => {
    //     console.log(motifs )
    //     console.log("All motifs loaded"); //load motifs can be called here in the future when a pattern gets automatically selected
    //     this.patternService.onPatternChange(this.patternService.selectedPatternID, this.canvas);
    //   }) //load motifs

  }



  @ViewChild('menu') menu!:ElementRef;
  contextMenu(e){
    e.preventDefault();
    console.log(e);
    if( this.canvas.getActiveObjects().length == 1 )
    {
      this.menu.nativeElement.style.display = "block";
      if(e.pageY > 600)
        this.menu.nativeElement.style.top = "600px";
      else
        this.menu.nativeElement.style.top = e.pageY + "px";
      this.menu.nativeElement.style.left = e.pageX + "px"
    }

  }

  dissapearContext(){
    this.menu.nativeElement.style.display = "none";
  }
  stopPropagation(e){
    e.stopPropagation(e);
  }

  //This functions spawns the motifs on the canvas, its called from the HTML
  spawnMotifObjectsFromSaveState()
  {
    this.motifsOnCanvas = {objects: []}; //clears motifs on canvas
    for (let motState in this.patternContents.motifs) //the json file of the pattern contents gotten from the server
    {
      let motStateTemp = this.patternContents.motifs[motState] //temp value, store as its potentially accessed a lot - for performance
      for (let cachedMot in this.motifService.cachedMotifs) //array of cached motifs, "the library" to select from
      {
        let cachedMotTemp = this.motifService.cachedMotifs[cachedMot] //store reference to cached motif, less cluttered
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
            this.canvas.add(clone).renderAll(); //the clone is spawned on the canvas

            //clone is pushed to motifsOnCanvas, used for layers and to have a reference of the motifs on canvas
            this.motifsOnCanvas.objects.push({objectRef: clone, objectName: cachedMotTemp.motifName, objectID: cachedMotTemp.id, motifURL: cachedMotTemp.motifURL }); //TODO: create interface
            //console.log(this.motifsOnCanvas.objects[0].objectRef.left)
          })
        }
      }
    }
  }

  newPattern(patternName: string)
  {
    return this.patternService.newPattern(patternName);
  }



  newPatternPopover() {
    let popoverReference:  HTMLIonPopoverElement;
    this.popoverController.create({
      component: NewPatternComponent,
      translucent: true,
      cssClass: 'smallScreen'
    }).then(resPop => {
      popoverReference = resPop;
      popoverReference.present().then(presentRes => {
        popoverReference.onDidDismiss().then((newPatternName) => {
          console.log(newPatternName);

          if (newPatternName.data !== undefined && newPatternName.data !== "")
          {
            const name: any = newPatternName.data
            this.newPattern(name)
          }
        })

      });
    })
  }



  openTab($event: MouseEvent, tabPage: string) {
    let i, tabContent, tabLinks;
    tabContent  = document.getElementsByClassName('tab-content');
    for (i = 0; i < tabContent.length; i++) {
      tabContent[i].style.display = 'none';
    }

    document.getElementById(tabPage).style.display  = 'block';
    (<HTMLIonButtonElement>document.getElementById(tabPage+'1')).setAttribute('color','dark');
    //(<HTMLElement>$event.currentTarget).className  += " active";
  }

  openTabSide($event: MouseEvent, tabPage: string) {
    let i, tabContent, tabLinks;
    tabContent  = document.getElementsByClassName('tab-content-side');
    for (i = 0; i < tabContent.length; i++) {
      tabContent[i].style.display = 'none';
    }

    document.getElementById(tabPage).style.display  = 'block';
    (<HTMLIonButtonElement>document.getElementById(tabPage+'1')).setAttribute('color','dark');
    //(<HTMLElement>$event.currentTarget).className  += " active";
  }

  openTabMain($event: MouseEvent, tabPage: string) {

    //Background preselected on, for better viewing of pattern
    this.background = true;
    this.canvas.backgroundColor = this.color;
    (<HTMLInputElement>document.getElementById('patternFrame')).style.backgroundColor = this.color;
    this.canvas.renderAll();
    this.refresh();


    let i, tabContent, tabLinks;
    tabContent  = document.getElementsByClassName('tab-content-main');
    for (i = 0; i < tabContent.length; i++) {
      tabContent[i].style.display = 'none';
    }

    document.getElementById(tabPage).style.display  = 'block';
    (<HTMLIonButtonElement>document.getElementById(tabPage+'1')).setAttribute('color','dark');
    //(<HTMLElement>$event.currentTarget).className  += " active";
  }


  moveUp(objectID: number) {
    this.addState();
    let currentObjects = this.getNonSpecialObjects();

    for (let index = 0; index < currentObjects.length; index ++)
    {
      if (currentObjects[index].IDOnCanvas === objectID)
      {
        if (currentObjects[index + 1])
        {
          const temp = currentObjects[index + 1];
          currentObjects[index + 1] = currentObjects[index];
          currentObjects[index] = temp;

          //this.canvas._objects = currentObjects;
          //this.canvas.renderAll(); //renders everything when done
          this.renderAllWithSpecial(currentObjects)
          this.motifService.motifsOnCanvas = currentObjects;
          return;
        }
        else
        {
          console.log("Is upper");
        }
      }
    }
  }

  moveDown(objectID: number) {
    this.addState();
    let currentObjects = this.getNonSpecialObjects();

    for (let index = 0; index < currentObjects.length; index ++)
    {
      if (currentObjects[index].IDOnCanvas === objectID)
      {
        if (currentObjects[index - 1])
        {
          const temp = currentObjects[index - 1];
          currentObjects[index - 1] = currentObjects[index];
          currentObjects[index] = temp;

          this.renderAllWithSpecial(currentObjects)
          this.motifService.motifsOnCanvas = currentObjects;
          return;
        }
        else
        {
          console.log("Is Lower");
        }
      }
    }
  }

  delete(objectID: number) {
    let currentObjects = this.getNonSpecialObjects();
    for (let index = 0; index < currentObjects.length; index ++)
    {
      if (currentObjects[index].IDOnCanvas === objectID) {
        this.canvas.remove(currentObjects[index]);
        this.motifService.motifsOnCanvas = this.getNonSpecialObjects();
        this.renderAllWithSpecial(this.canvas._objects);
      }
    }
  }

  deleteRightClick(){
    let selection = this.canvas.getActiveObject();
    if(selection == undefined) {return;}
    else
    {
      this.canvas.remove(selection);
      this.motifService.motifsOnCanvas = this.getNonSpecialObjects();
      this.renderAllWithSpecial(this.canvas._objects);
      this.dissapearContext();
    }
  }

  flipXRightClick(){
    (this.canvas.getActiveObject()).toggle('flipX');
    this.canvas.renderAll();
  }

  flipYRightClick(){
    (this.canvas.getActiveObject()).toggle('flipY');
    this.canvas.renderAll();
  }
  moveUpRightClick(){
    let object = this.canvas.getActiveObject();
    this.moveUp(object.IDOnCanvas);
  }

  moveDownRightClick(){
    let object = this.canvas.getActiveObject();
    this.moveDown(object.IDOnCanvas);
  }

  cloneRightClick(){
    let selection = this.canvas.getActiveObject();
    if(selection == undefined) {return;}
    else
    {
      selection.clone((clone)=>{
        clone.googleDriveID = selection.googleDriveID;
        clone.motifURL = selection.motifURL;
        clone.motifName = selection.motifName;
        clone.hasReflections = false;
        clone.IDOnCanvas = this.motifService.motifIndexIncValue++;
        clone.set('left', selection.left + 50);
        this.canvas.add(clone);
        this.motifService.motifsOnCanvas.push(clone);
        this.dissapearContext();
      })
    }
  }


  listCanvasObjects() {
    console.log(this.canvas.getObjects());
  }

  getSelectedObject()
  {

    //TODO: do this only when in color editor mode/ polygon mode
    this.activeObject = this.canvas.getActiveObject();
    console.log(this.canvas.getActiveObject().IDOnCanvas)
    console.log(this.canvas.getActiveObject().googleDriveID)


    // console.log(this.canvas.getObjects())
    // for (let obj in this.canvas.getObjects())
    // {
    //
    //   this.motifService.motifsOnCanvas.objects[obj].objectRef = this.canvas.getObjects()[obj];
    //   let shape = this.canvas.getObjects()[obj];
    //   // shape.set('fill', 'red');
    //   // shape.set('stroke', 'blue');
    //   // this.canvas.renderAll();
    //   // console.log(this.canvas.getObjects()[obj].fill);
    // }




    // let selectedObject = this.canvas.getActiveObject();
    // if (selectedObject)
    // {
    //   for (let obj in this.motifService.motifsOnCanvas)
    //   {
    //     if (selectedObject.ownMatrixCache.key === this.motifService.motifsOnCanvas[obj].ownMatrixCache.key)
    //     {
    //       console.log("equal: " + obj);
    //     }
    //   }
    //   console.log("End")
    // }

  }

  refresh(){
    console.log("refresh fired");
    this.pcan = (<HTMLInputElement>document.getElementById("imgPreview"));//canvas preview
    this.pcan.height = this.height / this.scale;
    this.pcan.width = this.width / this.scale;
    this.pcan.src = this.canvas.toDataURL();
    this.setPreview(true);
  }


  toggleExport()
  {

  }



  setDownload(shouldDisplay: boolean = false){
    console.log("downloading image...");

    this.canvasPre = new fabric.Canvas('previewFrame', {preserveObjectStacking: false});//set to 2nd Frame
    this.canvasPre.setHeight(this.width * this.pixel);
    this.canvasPre.setWidth(this.height * this.pixel);

    //alert(this.canvasPre.getWidth());//TESTING VALUE, seems good

    for (let i = 0; i < this.scale; i++)//rows, Y
    {
      for (let j = 0; j < this.scale; j++)//columns, X
      {
        let frame = new fabric.Image('imgPreview',{
          left: j * (this.canvasPre.width / this.scale),
          top: i * (this.canvasPre.width / this.scale),
          scaleY: this.pixel / this.scale,
          scaleX: this.pixel / this.scale,
          selectable: false, //REMOVE THIS TO CREATE ACCIDENTAL PATTERN GAME :D
          evented: false
        });

        this.canvasPre.add(frame);
      }


    }
    if (shouldDisplay)
    {
      setTimeout(()=>{
        this.setPreview()
      }, 50)
    }


    let can = this.canvasPre;




  }



  setPreview(shouldDisplay: boolean = false){
    console.log("set preview fired");

    this.canvasPre = new fabric.Canvas('previewFrame', {preserveObjectStacking: false});//set to 2nd Frame
    this.canvasPre.setHeight(this.height);//3000 pixels
    this.canvasPre.setWidth(this.width);//3000 pixels

    for (let i = 0; i < this.scale; i++)//rows, Y
    {
      for (let j = 0; j < this.scale; j++)//columns, X
      {
        let frame = new fabric.Image('imgPreview',{
          left: j * (this.canvasPre.width / this.scale),
          top: i * (this.canvasPre.height / this.scale),
          scaleY: 1 / this.scale,
          scaleX: 1 / this.scale,
          selectable: false, //REMOVE THIS TO CREATE ACCIDENTAL PATTERN GAME :D
          evented: false
        });

        this.canvasPre.add(frame);
      }


    }
    if (shouldDisplay)
    {
      setTimeout(()=>{
        this.setPreview()
      }, 50)
    }

    // const context = this.canvasPre.getContext();//get context of 3000x3000 canvas
    //
    //  const img = (<HTMLInputElement>document.getElementById("imgPattern"));//img quality test
    //  img.width = this.canvasPre.width;
    //  img.height = this.canvasPre.height;
    //  img.src = this.canvasPre.toDataURL();


    //context.scale(0.2,0.2);//scale down



     //let can = this.canvasPre;
     console.log("Preview Generated");
  }

  toggleBackground(e){
    if(e.detail.checked)
    {
      console.log("background enabled");
      this.background = true;
      this.canvas.backgroundColor = this.color;
      (<HTMLInputElement>document.getElementById('patternFrame')).style.backgroundColor = this.color;
      this.canvas.renderAll();
    }
    else{
      this.background = false;
      this.canvas.backgroundColor = null;
      (<HTMLInputElement>document.getElementById('patternFrame')).style.backgroundColor = null;
      this.canvas.renderAll();
    }
    this.canvas.requestRenderAll();
    this.refresh();
  }

  changeColor(){
    if(this.background === true)
    {
      //get color from input color
      const color	= (<HTMLInputElement>document.getElementById('fav_color')).value;
      this.color = color;

      this.canvas.backgroundColor = this.color;
      (<HTMLInputElement>document.getElementById('patternFrame')).style.backgroundColor = this.color;
      this.canvas.renderAll();
      this.refresh();//refresh preview
    }
    else{
      this.refresh();//refresh preview
      return;
    }

  }


  setSeamlessModifier(event: any) {
    //TODO: initialize hasReflections to fix error in console when changing from undefined to true/false when check box is ticked
    if (event.detail.checked === true)
    {
      this.addReflectionsToObject(this.activeObject)
    }
    else
    {
      this.activeObject.reflections = [];
    }

    this.renderAllWithSpecial(this.getNonSpecialObjects())

  }

  addReflectionsToObject(objectToAddTo: fabric.Object)
  {
    //adds reflections to the specified object
    objectToAddTo.reflections = [
      this.reflectionCreator(objectToAddTo, -this.canvasWidth, +this.canvasHeight),
      this.reflectionCreator(objectToAddTo, -this.canvasWidth, 0),
      this.reflectionCreator(objectToAddTo, -this.canvasWidth, -this.canvasHeight),
      this.reflectionCreator(objectToAddTo, 0, +this.canvasHeight),
      this.reflectionCreator(objectToAddTo, 0, -this.canvasHeight),
      this.reflectionCreator(objectToAddTo, +this.canvasWidth, +this.canvasHeight),
      this.reflectionCreator(objectToAddTo, +this.canvasWidth, 0),
      this.reflectionCreator(objectToAddTo, +this.canvasWidth, -this.canvasHeight)
    ]
  }
  scaleCanvas3(){
    this.scale = 3;

    const btn	= (<HTMLIonButtonElement>document.getElementById('s3'));
    btn.color = "dark";
    const btn1	= (<HTMLIonButtonElement>document.getElementById('s6'));
    btn1.color = "medium";
    const btn2	= (<HTMLIonButtonElement>document.getElementById('s9'));
    btn2.color = "medium";

    this.refresh();
  }

  scaleCanvas6(){
    this.scale = 6;

    const btn	= (<HTMLIonButtonElement>document.getElementById('s3'));
    btn.color = "medium";
    const btn1	= (<HTMLIonButtonElement>document.getElementById('s6'));
    btn1.color = "dark";
    const btn2	= (<HTMLIonButtonElement>document.getElementById('s9'));
    btn2.color = "medium";

    this.refresh();
  }

  scaleCanvas9(){
    this.scale = 9;

    const btn	= (<HTMLIonButtonElement>document.getElementById('s3'));
    btn.color = "medium";
    const btn1	= (<HTMLIonButtonElement>document.getElementById('s6'));
    btn1.color = "medium";
    const btn2	= (<HTMLIonButtonElement>document.getElementById('s9'));
    btn2.color = "dark";

    this.refresh();
  }


  reflectionCreator(parent: fabric.Object, topOffset: number, leftOffset: number)
  {
    let tempReflection: fabric.Object;
    parent.clone((reflection) => {
      reflection.set("top", parent.top + topOffset);
      reflection.set("left", parent.left + leftOffset);
      reflection.set("selectable", false);
      reflection.set("evented", false);
      reflection.set("opacity", this.opacity);
      tempReflection = reflection;
    })
    return tempReflection;
  }

  getNonSpecialObjects()
  {
    let tempAllObjects = this.canvas.getObjects();
    let nonSpecialObjects: fabric.Object[] = [];
    for (let i = 0; i < tempAllObjects.length; i++)
    {
      if (tempAllObjects[i].IDOnCanvas > -1)
      {
        nonSpecialObjects.push(tempAllObjects[i]);
      }
    }
    return nonSpecialObjects;
  }

  //takes objects array as parameter to render
  //The reflections are added to the array and then displayed


  renderAllWithSpecial(objects: fabric.Object[])
  {
    let userObjects: fabric.Object[] = []; //all objects the user spawned in, not including reflections or arrayMod objects
    for (let obj in objects) //check to make sure no special objects are in this array
    {
      if (objects[obj].IDOnCanvas != undefined)
      {
        userObjects.push(objects[obj]);
      }
    }

    let objectsToRender: fabric.Object[] = [];
    for (let userObj in userObjects)
    {
      if (userObjects[userObj].IDOnCanvas > -1)
      {
        this.decideRenderOrder(userObjects[userObj], objectsToRender, userObjects[userObj].shouldDisplaySeamlessMod);
      }
    }
    this.canvas._objects = objectsToRender;
    this.canvas.renderAll();
  }

  decideRenderOrder(obj: fabric.Object, futureRenderObjects: fabric.Object[], shouldDisplaySeamless: Boolean)
  {

    if (shouldDisplaySeamless && obj.reflections != undefined)
    {
      console.log("Pushed")
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
      this.decideRenderOrder(obj.arrayModifierElements[i], futureRenderObjects, shouldDisplaySeamless)
    }


  }

  updateReflectionsOf(obj: fabric.Object) {
    if (obj.reflections != undefined && obj.reflections.length > 0)
    {
      this.reflectionUpdater(obj,0, -this.canvasWidth, +this.canvasHeight, this.updateReflectionsOf)
      this.reflectionUpdater(obj,1, -this.canvasWidth, 0, this.updateReflectionsOf)
      this.reflectionUpdater(obj,2, -this.canvasWidth, -this.canvasHeight, this.updateReflectionsOf)
      this.reflectionUpdater(obj,3, 0, +this.canvasHeight, this.updateReflectionsOf)
      this.reflectionUpdater(obj,4, 0, -this.canvasHeight, this.updateReflectionsOf)
      this.reflectionUpdater(obj,5, +this.canvasWidth, +this.canvasHeight, this.updateReflectionsOf)
      this.reflectionUpdater(obj,6, +this.canvasWidth, 0, this.updateReflectionsOf)
      this.reflectionUpdater(obj,7, +this.canvasWidth, -this.canvasHeight, this.updateReflectionsOf)
    }

  }

  reflectionUpdater(parentObj: fabric.Object, reflectionIndex: number, topOffset: number, leftOffset: number, callback)
  {
    let ref = parentObj.reflections[reflectionIndex];
    ref.set("top",  parentObj.top + topOffset);
    ref.set("left",  parentObj.left + leftOffset);
    ref.set("scaleX",  parentObj.scaleX);
    ref.set("scaleY",  parentObj.scaleY);
    ref.rotate( parentObj.angle);
    ref.set('flipX', parentObj.flipX);
    ref.set('flipY', parentObj.flipY);
  }

  arrayModUpdater(arrayModIndex: number, topOffset: number, leftOffset: number)
  {
    let ref = this.activeObject.arrayModifierElements[arrayModIndex];
    ref.set("top",  this.activeObject.top + topOffset);
    ref.set("left",  this.activeObject.left + leftOffset);
    ref.set("scaleX",  this.activeObject.scaleX);
    ref.set("scaleY",  this.activeObject.scaleY);
    ref.rotate( this.activeObject.angle);
    ref.set('flipX', this.activeObject.flipX);
    ref.set('flipY', this.activeObject.flipY);

    if (ref.reflections)
    {
      this.updateReflectionsOf(ref);
      console.log("Has reflections")
    }

  }


  changeArrayModifierNumber(num: number, distance: number) {
    //if the value is undefined, define it then add num to it
    if (!this.activeObject.nrOfArrayObjects)
    {
      this.activeObject.nrOfArrayObjects = 0;
      this.activeObject.arrayModifierElements = []; //initialize array
    }
    //makes so the nr of array modifier elements cant be negative
    if (!(this.activeObject.nrOfArrayObjects == 0 && num < 0))
    {
      this.activeObject.nrOfArrayObjects += num;
      if (num > 0)
      {
        //if number is positive, add new clone
        const {y, x} = this.calculatePositionFromDirection(distance, this.activeObject.nrOfArrayObjects);
        let tempObject = this.reflectionCreator(this.activeObject, y, x); //create the array modifier object with offset
        this.addReflectionsToObject(tempObject) //add reflections to array modifier object
        this.activeObject.arrayModifierElements.push(tempObject);
        console.log("Pushed new arr mod obj")
      }
      else
      {
        //if negative, pop object
        this.activeObject.arrayModifierElements.pop();
      }
      this.renderAllWithSpecial(this.getNonSpecialObjects());
    }
  }

  toRadians (angle) {
    return angle * (Math.PI / 180);
  }

  //object index is the nth object in the parent objects array-modifier array
  calculatePositionFromDirection(distance: number, objIndex: number)
  {
    const tempDist = distance * objIndex;
    const tempSlideVal = this.toRadians( this.directionSliderValue - 180);
    const y = tempDist * Math.sin(tempSlideVal)
    const x = tempDist * Math.sin(1.5708 - tempSlideVal)
    return {y, x}; //return coordinates
  }

  updateArrModOfSelected() {

    if (this.activeObject.nrOfArrayObjects)
    {
      for (let arrObj = 0; arrObj < this.activeObject.nrOfArrayObjects; arrObj++)
      {
        const {y, x} = this.calculatePositionFromDirection(this.distBetweenArrayModElements, arrObj + 1)
        this.arrayModUpdater(arrObj,  y, x);
      }
    }
    //this.renderAllWithSpecial(this.getNonSpecialObjects());
    this.canvas.renderAll()
    console.log(this.directionSliderValue)
  }

  download(){
    console.log("downloading");
    //this.refresh();
    this.setDownload();

    const context = this.canvasPre.getContext();

    //scale up canvas
    //this.canvasPre.width = this.canvasPre.width * this.pixel;
    //this.canvasPre.height = this.canvasPre.height * this.pixel;

    //scale up context
    //context.scale(this.pixel, this.pixel); //200%, 500%, 1000%


    const dataURL = this.canvasPre.toDataURL();



    if(this.ptn)
    {
      this.downloadURI(dataURL, 'pattern.png');
    }
    else{
      this.downloadURI(dataURL, 'frame.png');
    }


  }

  downloadURI(uri, name) {
    const link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    //delete this.link;

    this.refresh();//REFRESH AFTER DOWNLOAD
  }


  export1(){
    console.log("EXPORT LOW RESOLUTION");
    this.pixel = 1;
    const btn	= (<HTMLIonButtonElement>document.getElementById('e1'));
    btn.color = "dark";
    const btn1	= (<HTMLIonButtonElement>document.getElementById('e2'));
    btn1.color = "medium";
    const btn2	= (<HTMLIonButtonElement>document.getElementById('e5'));
    btn2.color = "medium";

    //this.download();
  }

  export2(){
    console.log("EXPORT MEDIUM RESOLUTION");
    this.pixel = 2;

    const btn	= (<HTMLIonButtonElement>document.getElementById('e1'));
    btn.color = "medium";
    const btn1	= (<HTMLIonButtonElement>document.getElementById('e2'));
    btn1.color = "dark";
    const btn2	= (<HTMLIonButtonElement>document.getElementById('e5'));
    btn2.color = "medium";
    //this.download();
  }
  export5(){
    console.log("EXPORT HIGH RESOLUTION");
    this.pixel = 5;

    const btn	= (<HTMLIonButtonElement>document.getElementById('e1'));
    btn.color = "medium";
    const btn1	= (<HTMLIonButtonElement>document.getElementById('e2'));
    btn1.color = "medium";
    const btn2	= (<HTMLIonButtonElement>document.getElementById('e5'));
    btn2.color = "dark";
    //this.download();
  }

  frame(){
    const scl = this.scale;//save state of scale
    this.scale = 1;
    this.ptn = false;//for the name of image
    this.download();
    this.scale = scl;//reset to prev state
  }

  pattern(){
    this.ptn = true;//for the name of image
    this.download();
  }

}
