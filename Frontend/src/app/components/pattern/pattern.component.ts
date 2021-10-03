import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MotifServiceService } from '../../services/motif-service.service';

import { Group } from 'konva/lib/Group';
import { Shape, ShapeConfig } from 'konva/lib/Shape';
import {motifsInterface} from '../../Interfaces/motifsInterface';
import { PatternService } from '../../services/pattern.service';
import {MotifCatalogueComponent} from '../../popovers/motif-catalogue/motif-catalogue.component';
import {MotifUploadComponent} from '../../popovers/motif-upload/motif-upload.component';
import {IPatternContentsInterface} from '../../Interfaces/patternContents.interface';
import {HttpClient} from '@angular/common/http';
import {fabric} from 'fabric';



import { ActivatedRoute } from '@angular/router';
import {IMotifStateInterface} from '../../Interfaces/motifDetails.interface';
import {AlertController, LoadingController, PopoverController} from '@ionic/angular';
import {ICollectionsContent} from '../../Interfaces/collectionContents.interface';
import {NewPatternComponent} from '../../popovers/new-pattern/new-pattern.component';

import Konva from "konva";
import pixelRatio = Konva.pixelRatio;
import {Originator} from "../../Classes/MementoDesignPattern/Originator";
import {Caretaker} from "../../Classes/MementoDesignPattern/Caretaker";
import {motif} from '../../Classes/motif.class';
import {ThreeDLinkComponent} from "../../popovers/three-d-link/three-d-link.component";
import {CollectionsServiceService} from "../../services/collections-service.service";
import {ServerLinkService} from "../../services/server-link.service";
import {element} from "protractor";
import {ExportComponent} from "../../popovers/export/export.component";



@Component({
  selector: 'app-pattern',
  templateUrl: './pattern.component.html',
  styleUrls: ['./pattern.component.scss'],
})
export class PatternComponent implements OnInit {

  ///search
  items = [{ name: 'archie' }, { name: 'jake' }, { name: 'richard' }];
  values = [];
  searchableMotifs=[];

  canvasWidth = 600;
  canvasHeight = 600;
  colourList = [];
  exportFormat? : string = ".PNG";


  @ViewChild('parent') private parentRef: ElementRef<HTMLElement>;
  activeObject: fabric.Object;

  onKey(event: any) {
    const query = event.target.value.toLowerCase();
    const p = document.querySelector('p.testing');
    console.log(query);
    console.table(this.searchableMotifs);
    const doc = document.getElementById('testing');
    const arrs =Array.from(this.parentRef.nativeElement.children as HTMLCollectionOf<HTMLElement>);
    console.log(arrs.length);
    requestAnimationFrame(() => {
      arrs.forEach(async item => {
        const shouldShow =await item.textContent.toLowerCase().indexOf(query) > -1;
        item.style.display = shouldShow ? 'block' : 'none';
      });
    });
  }

  /////////////////////
  selected!: (Group | Shape);
  selectedPattern: any;
  //motifs?: motifsInterface;


  canvas?: fabric.Canvas;
  canvasPre?: fabric.Canvas;
  path?: fabric.Path;
  img?: fabric.Image;
  //motifSaveStates: IMotifStateInterface[] = [];
  motifsOnCanvas: {objects: {objectRef: fabric.Object; objectName: string; objectID: string; motifURL: string}[]} = {objects: []};
  motifObjects: motif[] = [];
  canvasMotifs: fabric.Object[] = [];
  seamlessClones: fabric.Object[] = [];
  motifCount: number = 0;
  scale: number = 3;
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
  originator : Originator = new Originator();
  caretaker : Caretaker = new Caretaker();
  undoClicked: boolean = false;

  createBackground: boolean = false;



  pcan = (<HTMLInputElement>document.getElementById('imgPreview'));//canvas preview

  //saving patterns in pattern Contents interface
  patternContents: IPatternContentsInterface = {patternName: '', patternID: '', motifs: []} as IPatternContentsInterface;



  constructor(public motifService: MotifServiceService,
              private route: ActivatedRoute,
              public patternService: PatternService,
              private popoverController: PopoverController,
              private http: HttpClient,
              private loadingController: LoadingController,
              public collectionService: CollectionsServiceService,
              private serverLink: ServerLinkService
              ) {}


  ngOnInit(){

    this.canvas = new fabric.Canvas('patternFrame', { preserveObjectStacking: true });
    this.canvas.setHeight(this.width);
    this.canvas.setWidth(this.height);
    this.canvas.selection = false; //disables group selection
    this.canvas.backgroundColor = "white";

    this.background = true;
    //this.canvas.backgroundColor = this.color;
    (<HTMLInputElement>document.getElementById('patternFrame')).style.backgroundColor = "white";
    this.canvas.renderAll();



    this.originator = new Originator();
    this.caretaker = new Caretaker();

    //gets the requested Collections ID in the path


      this.loadingController.create({
        message: "Initializing..."
      }).then(loaderResult => {
        loaderResult.present().then(r => {
          this.patternService.getCurrentCollectionJSON(this.collectionService.currentCollectionID)
            .then((collectionContent: ICollectionsContent) => {
              loaderResult.dismiss().then();
              //TODO pick last edited pattern by date if one exists
              if (collectionContent.childPatterns[0])
              {
                this.patternService.getAndLoadSavedPattern(collectionContent.childPatterns[0].patternID, this.canvas)
                //this.motifService.motifsOnCanvas = this.getNonSpecialObjects();
                //this.renderAllWithSpecial(this.motifService.motifsOnCanvas);
              }

            })

            })
        })




      //this.motifLoad();
      //this.getMotifs();






    this.canvas.on('selection:created',(r) => {
      this.getSelectedObject();
      document.getElementById('controls').style.display = 'block';
    });
    this.canvas.on('selection:cleared',(r) => {
      document.getElementById('controls').style.display = 'none';
    });

    this.canvas.on('selection:updated',(r) => {
      this.getSelectedObject();
    });

    this.canvas.on('object:moving' ,(r) => {
      if (this.activeObject.shouldDisplaySeamlessMod)
      {
        this.motifService.updateReflectionsOf(this.activeObject, this.canvas);

        console.log('Moving Reflections');
      }
      this.motifService.updateArrModOfSelected(this.activeObject, this.canvas);
    });

    this.canvas.on('object:rotating' ,(r) => {
      if (this.activeObject.shouldDisplaySeamlessMod)
      {
        this.motifService.updateReflectionsOf(this.activeObject, this.canvas);

        console.log('Moving Reflections');
      }
      this.motifService.updateArrModOfSelected(this.activeObject, this.canvas);
    });

    this.canvas.on('object:scaling' ,(r) => {
      if (this.activeObject.shouldDisplaySeamlessMod)
      {
        this.motifService.updateReflectionsOf(this.activeObject, this.canvas);

        console.log('Moving Reflections');
      }
      this.motifService.updateArrModOfSelected(this.activeObject, this.canvas);
    });

    this.canvas.on('object:rotated' ,(r) => {
      this.addState();
      this.undoClicked = false;
    });

    this.canvas.on('object:scaled' ,(r) => {
      this.addState();
      this.undoClicked = false;
    });

    // this.canvas.on('object:removed' ,(r) => {
    //   this.addState();
    //   this.undoClicked = false;
    // });
    // this.canvas.on('object:removed' ,(r) => {
    //   this.addState();
    //   this.undoClicked = false;
    // });




    // this.canvas.on('object:moving' ,(r) => {
    //
    //
    //   // if(this.caretaker.notEmpty() == false){
    //   //   console.log('added');
    //   //   this.addState();
    //   //   this.undoClicked = false;
    //   // }
    // })

    // this.canvas.on('object:moving' ,(r) => {
    //   let tempstate;
    //   if(this.undoClicked == true){
    //     tempstate = this.getState();
    //     // this.caretaker.emptyStates();
    //     this.canvas.fire('object:moved');
    //     this.addStateGivenState(tempstate);
    //   }
    //
    // })



    // this.canvas.on('object:moved' ,(r) => {
    //   let tempstate;
    //   if(this.undoClicked == true){
    //     tempstate = this.getState();
    //     this.caretaker.emptyStates();
    //     this.addStateGivenState(tempstate);
    //   }
    //   else{
    //     this.addState();
    //   }
    //   //this.addStateGivenState(tempstate);
    //   this.undoClicked = false;
    // })

    this.canvas.on('object:moved' ,(r) => {
      // let tempstate;
      // if(this.undoClicked == true){
      //   tempstate = this.getState();
      //   this.addStateGivenState(tempstate);
      // }
      // else{
        this.addState();
      // }
      // //this.addStateGivenState(tempstate);
      // this.undoClicked = false;
    })

    //this.frame = document.getElementById('patternFrame');//get div of workarea

    // this.canvasPre = new fabric.Canvas('previewFrame', { preserveObjectStacking: true });
    // this.canvasPre.setHeight(this.width);
    // this.canvasPre.setWidth(this.height);
    // this.canvasPre.backgroundColor = null;
    //
    // this.img = new fabric.Image('previewFrame');


    let journey = "";
    let padding = 30;
    //X LINES
    for(let i = 1; i < (padding);i++)
    {
      journey = journey + "M 0 " + (i * (this.canvas.height / padding)) + "L "+ (this.canvas.width) + " " + (i * (this.canvas.width / padding)) + " ";
    }
    //Y LINES
    for(let j = 1; j < (padding);j++)
    {
      journey = journey + "M " + (j * (this.canvas.width / padding)) + " 0 L " + (j * (this.canvas.width / padding)) + " " + (this.canvas.height) + " ";
    }

    this.path = new fabric.Path(journey, {
      stroke: "black",
      strokeWidth: 2,
      selectable: false,
      evented: false,
      name: "grid",
      opacity: 0.3
    });

  }

  getState(){
    let state : fabric.Object[] = [];
    let motifs = this.motifService.getNonSpecialObjects(this.canvas);
    for( let i = 0 ; i < motifs.length ; i++ ){
      motifs[i].clone((clone)=>{
        clone.googleDriveID =  motifs[i].googleDriveID;
        clone.motifURL =  motifs[i].motifURL;
        clone.motifName =  motifs[i].motifName;
        clone.IDOnCanvas = motifs[i].IDOnCanvas;
        clone.hasReflections = false;
        state.push(clone);
      })
    }
    return state;
  }

  addStateGivenState(aState)
  {
    this.originator.setState(aState);
    this.caretaker.addMemento(this.originator.saveStateToMemento());

  }

  addState()
  {


   let motifSaveStates: IMotifStateInterface[] = [];
   let patternContents: IPatternContentsInterface = { patternName: "", patternID: "", motifs: [] };

    const tempMotifsOnCanvas = this.motifService.motifsOnCanvas; //for performance, to have a local copy and not go to the service each time

    for (const mot in tempMotifsOnCanvas)
    {
      //this.motifsOnCanvas.objects[mot].objectRef.
      motifSaveStates.push({
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
    patternContents.motifs = motifSaveStates;


    // let state : fabric.Object[] = [];
    // let motifs : fabric.Object[] = [];
    // motifs = this.motifService.getNonSpecialObjects(this.canvas);
    // // for(let i = 0 ; i < this.canvas.getObjects().length; i++){
    // //   motifs[i] = this.canvas._objects[i];
    // // }
    // for( let i = 0 ; i < motifs.length ; i++ ){
    //   motifs[i].clone((clone)=>{
    //     clone.googleDriveID =  motifs[i].googleDriveID;
    //     clone.motifURL =  motifs[i].motifURL;
    //     clone.motifName =  motifs[i].motifName;
    //     clone.IDOnCanvas = motifs[i].IDOnCanvas;
    //     clone.hasReflections = false;
    //
    //     clone.ArrayModSpacing = motifs[i].ArrayModSpacing;
    //     clone.ArrayModDirection = motifs[i].ArrayModDirection;
    //     clone.shouldDisplaySeamlessMod = motifs[i].shouldDisplaySeamlessMod;
    //
    //     //clone.arrayModifierElements = motifs[i].arrayModifierElements;
    //
    //     state.push(clone);
    //   })
    // }
    // console.log("Saved State " );
    // console.log(state);
    this.originator.setState(patternContents);
    this.caretaker.addMemento(this.originator.saveStateToMemento());
    console.log("Saved State " );
   // console.log(state);
  }



  getObjects(){
    console.log(this.canvas.getObjects());
    console.log(this.motifService.getNonSpecialObjects(this.canvas));
  }

  undo()
  {
    console.log(this.getState());
    this.undoClicked = true;
    if(this.caretaker.notEmpty() == false) return;
    else {
      let state = this.originator.restoreStateFromMemento(this.caretaker.getMemento())
      console.log(state);
      // this.canvas.getObjects().forEach( (element) =>{
      //   this.canvas.remove(element);
      // })
      this.canvas.clear();
      this.motifService.spawnMotifObjectsFromSaveState(state, this.canvas);
      // this.motifService.motifsOnCanvas = state;
      //
      // this.canvas._objects = [];
      // for(let i = 0 ; i < state.length ; i++){
      //   this.canvas.add(state[i]);
      // }
      // //this.canvas.renderAll();
      // this.motifService.renderAllWithSpecial(this.motifService.getNonSpecialObjects(this.canvas), this.canvas);
    }
  }

  emptyState()
  {
    this.caretaker.emptyStates();
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



  @ViewChild('menu') menu!: ElementRef;
  contextMenu(e){
    e.preventDefault();
    console.log(e);
    if( this.canvas.getActiveObjects().length == 1 )
    {
      this.menu.nativeElement.style.display = 'block';
      if(e.pageY > 600)
      {this.menu.nativeElement.style.top = '600px';}
      else
      {this.menu.nativeElement.style.top = e.pageY + 'px';}
      this.menu.nativeElement.style.left = e.pageX + 'px';
    }

  }

  dissapearContext(){
    this.menu.nativeElement.style.display = 'none';
  }
  stopPropagation(e){
    e.stopPropagation(e);
  }



  newPattern(patternName: string)
  {
    return this.patternService.newPattern(patternName);
  }
  spawn(mot: motif){
    this.addState();
    this.motifService.spawnMotifObject(mot, this.canvas);
    this.addState();
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

          if (newPatternName.data !== undefined && newPatternName.data !== '')
          {
            const name: any = newPatternName.data;
            this.newPattern(name);
          }
        });

      });
    });
  }





  openTab($event: MouseEvent, tabPage: string) {
    let i; let tabContent; let tabLinks;
    tabContent  = document.getElementsByClassName('tab-content');
    for (i = 0; i < tabContent.length; i++) {
      tabContent[i].style.display = 'none';
    }

    document.getElementById(tabPage).style.display  = 'block';
    (<HTMLIonButtonElement>document.getElementById(tabPage+'1')).setAttribute('color','dark');
    //(<HTMLElement>$event.currentTarget).className  += " active";
  }

  openTabSide($event: MouseEvent, tabPage: string) {

    this.refresh();
    this.changeColor();
    let i; let tabContent; let tabLinks;
    tabContent  = document.getElementsByClassName('tab-content-side');
    for (i = 0; i < tabContent.length; i++) {
      tabContent[i].style.display = 'none';
    }

    document.getElementById(tabPage).style.display  = 'block';


    //reset buttons to normal
    (<HTMLIonButtonElement>document.getElementById('Changes1')).setAttribute('color','medium');
    (<HTMLIonButtonElement>document.getElementById('Modifiers1')).setAttribute('color','medium');
    (<HTMLIonButtonElement>document.getElementById('Exports1')).setAttribute('color','medium');
    (<HTMLIonButtonElement>document.getElementById('MotLib1')).setAttribute('color','medium');
    (<HTMLIonButtonElement>document.getElementById('Color1')).setAttribute('color','medium');


    //highlight selected button
    (<HTMLIonButtonElement>document.getElementById(tabPage+'1')).setAttribute('color','default');
    //(<HTMLElement>$event.currentTarget).className  += " active";

    //let theme = document.body.getAttribute('color-theme');
    //console.log("Current theme is: "+ theme);





  }

  openTabMain($event: MouseEvent, tabPage: string) {

    //Background preselected on, for better viewing of pattern
    //this.background = true;
    //if(this.createBackground === false)
    //{
      //this.background = true;
      //this.createBackground = true;
    //}


    //this.canvas.backgroundColor = this.color;
    //(<HTMLInputElement>document.getElementById('patternFrame')).style.backgroundColor = this.color;
    this.canvas.renderAll();
    this.refresh();


    let i; let tabContent; let tabLinks;
    tabContent  = document.getElementsByClassName('tab-content-main');
    for (i = 0; i < tabContent.length; i++) {
      tabContent[i].style.display = 'none';
    }

    document.getElementById(tabPage).style.display  = 'block';

    //reset to normal
    (<HTMLIonButtonElement>document.getElementById('WorkArea1')).setAttribute('color','medium');
    (<HTMLIonButtonElement>document.getElementById('Preview1')).setAttribute('color','medium');

    //change view of selected button
    (<HTMLIonButtonElement>document.getElementById(tabPage+'1')).setAttribute('color','default');




    //(<HTMLElement>$event.currentTarget).className  += " active";
  }


  moveUp(objectID: number) {
    this.addState();
    const currentObjects = this.motifService.getNonSpecialObjects(this.canvas);

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
          this.motifService.renderAllWithSpecial(currentObjects, this.canvas);
          this.motifService.motifsOnCanvas = currentObjects;
          return;
        }
        else
        {
          console.log('Is upper');
        }
      }
    }
  }

  moveDown(objectID: number) {
    this.addState();
    const currentObjects = this.motifService.getNonSpecialObjects(this.canvas);

    for (let index = 0; index < currentObjects.length; index ++)
    {
      if (currentObjects[index].IDOnCanvas === objectID)
      {
        if (currentObjects[index - 1])
        {
          const temp = currentObjects[index - 1];
          currentObjects[index - 1] = currentObjects[index];
          currentObjects[index] = temp;

          this.motifService.renderAllWithSpecial(currentObjects, this.canvas);
          this.motifService.motifsOnCanvas = currentObjects;
          return;
        }
        else
        {
          console.log('Is Lower');
        }
      }
    }
  }

  getMotifIndex(objectID: number){
    const currentObjects = this.motifService.getNonSpecialObjects(this.canvas);
    for (let index = 0; index < currentObjects.length; index++) {
      if (currentObjects[index].IDOnCanvas === objectID) {
        return index;
      }
    }
  }

  makeSelected(objectID: number) {
    const currentObjects = this.motifService.getNonSpecialObjects(this.canvas);
    const index = this.getMotifIndex(objectID);
    this.canvas.setActiveObject(currentObjects[index]);
    this.canvas.renderAll();
  }

  delete(objectID: number) {
   // this.addState();
    const currentObjects = this.motifService.getNonSpecialObjects(this.canvas);
    const index = this.getMotifIndex(objectID);
    this.canvas.remove(currentObjects[index]);
    this.motifService.motifsOnCanvas = this.motifService.getNonSpecialObjects(this.canvas);
    this.motifService.renderAllWithSpecial(this.canvas._objects, this.canvas);
    this.addState();

  }

  deleteRightClick(){
    const selection = this.canvas.getActiveObject();
    if(selection == undefined) {return;}
    else
    {
      this.addState();
      this.canvas.remove(selection);
      this.motifService.motifsOnCanvas = this.motifService.getNonSpecialObjects(this.canvas);
      this.motifService.renderAllWithSpecial(this.canvas._objects, this.canvas);
      this.dissapearContext();
      this.addState();
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
    const object = this.canvas.getActiveObject();
    this.moveUp(object.IDOnCanvas);
  }

  moveDownRightClick(){
    const object = this.canvas.getActiveObject();
    this.moveDown(object.IDOnCanvas);
  }

  cloneRightClick(){
    const selection = this.canvas.getActiveObject();
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
      });
    }
  }

  recenterClick(){
    const object = this.canvas.getActiveObject();
    this.recenter(object.IDOnCanvas);
    this.dissapearContext();
  }


  recenter(objectID: number) {
    const currentObjects = this.motifService.getNonSpecialObjects(this.canvas);
    const index = this.getMotifIndex(objectID);
    currentObjects[index].center();
    this.makeSelected(index);
    this.canvas.fire('object:moving');
  }

  listCanvasObjects() {
    console.log(this.canvas.getObjects());
  }

  getSelectedObject()
  {

    //TODO: do this only when in color editor mode/ polygon mode
    this.activeObject = this.canvas.getActiveObject();
    console.log(this.canvas.getActiveObject().IDOnCanvas);
  }

  refresh(){
    console.log('refresh fired');
    this.pcan = (<HTMLInputElement>document.getElementById('imgPreview'));//canvas preview
    this.pcan.height = this.height / this.scale;
    this.pcan.width = this.width / this.scale;
    this.pcan.src = this.canvas.toDataURL();
    this.setPreview(true);
  }


  setDownload(shouldDisplay: boolean = false){
    console.log('downloading image...');

    this.canvasPre = new fabric.Canvas('previewFrame', {preserveObjectStacking: false});//set to 2nd Frame
    this.canvasPre.setHeight(this.width * this.pixel);
    this.canvasPre.setWidth(this.height * this.pixel);

    //alert(this.canvasPre.getWidth());//TESTING VALUE, seems good

    for (let i = 0; i < this.scale; i++)//rows, Y
    {
      for (let j = 0; j < this.scale; j++)//columns, X
      {
        const frame = new fabric.Image('imgPreview',{
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
        this.setPreview();
      }, 50);
    }


    const can = this.canvasPre;




  }



  setPreview(shouldDisplay: boolean = false){
    console.log('set preview fired');

    this.canvasPre = new fabric.Canvas('previewFrame', {preserveObjectStacking: false});//set to 2nd Frame
    this.canvasPre.setHeight(this.height);//3000 pixels
    this.canvasPre.setWidth(this.width);//3000 pixels

    for (let i = 0; i < this.scale; i++)//rows, Y
    {
      for (let j = 0; j < this.scale; j++)//columns, X
      {
        const frame = new fabric.Image('imgPreview',{
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
    //ATTENTION: DO NOT TOUCH THE BELOW
    if (shouldDisplay)
    {
      setTimeout(()=>{
        this.setPreview();
      }, 50);
    }

    // const context = this.canvasPre.getContext();//get context of 3000x3000 canvas
    //
    //  const img = (<HTMLInputElement>document.getElementById("imgPattern"));//img quality test
    //  img.width = this.canvasPre.width;
    //  img.height = this.canvasPre.height;
    //  img.src = this.canvasPre.toDataURL();


    //context.scale(0.2,0.2);//scale down



    //let can = this.canvasPre;
    console.log('Preview Generated');
  }



  gridOn(){
    this.canvas.add(this.path);
  }

  gridOff(){
    this.canvas.remove(this.path);
  }

  toggleGrid(e)
  {
    if(e.detail.checked)
    {
      this.gridOn();
    }

    else{
      this.gridOff();
    }

  }


  toggleBackground(e){
    if(e.detail.checked)
    {
      console.log('background enabled');
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
   this.addState();
    if (event.detail.checked === true)
    {
      this.motifService.addReflectionsToObject(this.activeObject, this.canvas);
      this.activeObject.shouldDisplaySeamlessMod = true;
    }
    else
    {
      this.activeObject.reflections = [];
      this.activeObject.shouldDisplaySeamlessMod = false;
    }

    this.motifService.renderAllWithSpecial(this.motifService.getNonSpecialObjects(this.canvas), this.canvas);


  }

  getThemeBtn(){

  }




  scaleCanvas3(){
    this.scale = 3;

    const btn	= (<HTMLIonButtonElement>document.getElementById('s3'));
    btn.color = 'primary';
    const btn1	= (<HTMLIonButtonElement>document.getElementById('s6'));
    btn1.color = 'medium';
    const btn2	= (<HTMLIonButtonElement>document.getElementById('s9'));
    btn2.color = 'medium';

    this.refresh();
  }

  scaleCanvas6(){
    this.scale = 6;

    const btn	= (<HTMLIonButtonElement>document.getElementById('s3'));
    btn.color = 'medium';
    const btn1	= (<HTMLIonButtonElement>document.getElementById('s6'));
    btn1.color = 'primary';
    const btn2	= (<HTMLIonButtonElement>document.getElementById('s9'));
    btn2.color = 'medium';

    this.refresh();
  }

  scaleCanvas9(){
    this.scale = 9;

    const btn	= (<HTMLIonButtonElement>document.getElementById('s3'));
    btn.color = 'medium';
    const btn1	= (<HTMLIonButtonElement>document.getElementById('s6'));
    btn1.color = 'medium';
    const btn2	= (<HTMLIonButtonElement>document.getElementById('s9'));
    btn2.color = 'primary';

    this.refresh();
  }






  //takes objects array as parameter to render
  //The reflections are added to the array and then displayed




















  download(){
    console.log('downloading');
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

  motifLoad() {
    return new Promise((success, failure) => {
      this.loadingController.create({
        message: "Loading Your Motifs..."
      }).then(loaderResult => {
        loaderResult.present().then(r => {
          this.motifService.getAllMotifs()
            .subscribe(() => {
              loaderResult.dismiss().then()
              success("success")
            });
        })
      })
    })

  }


  export1(){
    console.log('EXPORT LOW RESOLUTION');
    this.pixel = 1;
    const btn	= (<HTMLIonButtonElement>document.getElementById('e1'));
    btn.color = 'primary';
    const btn1	= (<HTMLIonButtonElement>document.getElementById('e2'));
    btn1.color = 'medium';
    const btn2	= (<HTMLIonButtonElement>document.getElementById('e5'));
    btn2.color = 'medium';

    //this.download();
  }

  export2(){
    console.log('EXPORT MEDIUM RESOLUTION');
    this.pixel = 2;

    const btn	= (<HTMLIonButtonElement>document.getElementById('e1'));
    btn.color = 'medium';
    const btn1	= (<HTMLIonButtonElement>document.getElementById('e2'));
    btn1.color = 'primary';
    const btn2	= (<HTMLIonButtonElement>document.getElementById('e5'));
    btn2.color = 'medium';
    //this.download();
  }
  export5(){
    console.log('EXPORT HIGH RESOLUTION');
    this.pixel = 5;

    const btn	= (<HTMLIonButtonElement>document.getElementById('e1'));
    btn.color = 'medium';
    const btn1	= (<HTMLIonButtonElement>document.getElementById('e2'));
    btn1.color = 'medium';
    const btn2	= (<HTMLIonButtonElement>document.getElementById('e5'));
    btn2.color = 'primary';
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

  uploadThumbnail() {

    try {
      const formData = new FormData();
      //TODO: append unique ID to file name so the server knows which files belong to which user
      formData.append('files', this.dataURItoBlob(this.canvas.toDataURL()), 'testName' + '.png');
      this.http.post(this.serverLink.getServerLink() + '/api/uploadMotif', formData, {withCredentials: true})
        .subscribe(response => {
          console.log(response);
        });
    }
    catch (err)
    {
      console.log(err);
    }

  }

  open3DViewer(ev: any) {

    try {
      const formData = new FormData();
      //TODO: append unique ID to file name so the server knows which files belong to which user
      formData.append('files', this.dataURItoBlob(this.canvas.toDataURL()), 'canvasPicture' + '.png');
      this.http.post(this.serverLink.getServerLink() + '/threeDViewer', formData, {withCredentials: true})
        .subscribe((response: any) => {

          let popoverReference:  HTMLIonPopoverElement;

          console.log(this.canvas.toDataURL())
          this.threeDLinkPopover(ev,response.fileName)
            .then(resPop => {
              resPop.present().then(() => {
                resPop.onDidDismiss().then(() => {
                  window.open(this.serverLink.getServerLink() + '/threeDViewer', '_blank').focus();
                })
                }

              )
            });

          console.log(response);
        });





    }
    catch (err)
    {
      console.log(err);
    }
  }


  threeDLinkPopover(ev: any, imageName: string) {
    return this.popoverController.create({
      component: ThreeDLinkComponent,
      translucent: true,
      cssClass: 'smallScreen',
      componentProps: {
        imageName: imageName
      }
    })
  }

  updateArrayModifier(parent: fabric.Object, num: number, distance: number, canvas: fabric.Canvas)
  {
    this.addState();
    this.motifService.changeArrayModifierNumber(parent,num, distance, canvas);
  }

  refreshColor(){
    this.patternColour();
  }

  patternColour(){
    const ctx = this.canvas.getContext();
    const imageDt = ctx.getImageData(0,0,this.canvas.width, this.canvas.height);
    const data = imageDt.data;
    let i; let n;
    let ret = '';

    for(i = 0, n = data.length; i < n; i += 4){
      const r  = data[i];
      const g  = data[i + 1];
      const b  = data[i + 2];
      const hex = this.rgbToHex('rgb('+r+','+g+','+b+')');

      if (!(hex in this.colourList)){
        this.colourList[hex] = 1;
      }
      else {
        this.colourList[hex]++;
      }
    }
    // keys are the elements are strings corresponding to the enumerable properties found directly upon object
    const keys = Object.keys(this.colourList);

    keys.sort();

    // remove duplicate keys
    const used = [];
    let prev = '';

    console.log('before loop');
    let count = 0;
    for (i =1; i < keys.length; i++){
      console.log('in loop');

      if(!used.includes(this.colourList[keys[i]])){
        // eslint-disable-next-line eqeqeq
        if(prev != keys[i].charAt(1)){
          used.push(this.colourList[keys[i]]);

          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          const item = document.querySelector('#item'+ count) as HTMLElement;
          const hx = document.querySelector('#hx'+ count) as HTMLElement;
          console.log(keys[i]);
          item.style.backgroundColor = keys[i];
          hx.innerHTML = keys[i];

          prev = keys[i].charAt(1);
          count++;
          ret += keys[i] + ',';
        }
      }
    }
    return ret;
  }

  rgbToHex(str: string){
    const rgb = str.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
    function hex(x) {
      return ('0' + parseInt(x, 10).toString(16)).slice(-2);
    }
    return '#' + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
  }

  exportCanvas()
  {
    console.log(this.exportFormat);
    if (this.exportFormat == ".PDF" || this.exportFormat == ".DWG" || this.exportFormat == ".DXF" )
    {

      this.loadingController.create({
        message: "Exporting, please wait..."
      }).then(loaderResult => {
        loaderResult.present().then(r => {
          this.patternService.exportCanvasAsSVG(this.canvas, this.exportFormat)
            .subscribe((res: any) => {
              console.log(res.resultUrl)
              if (res.format == 'pdf')
              {
                loaderResult.dismiss().then();
                window.open(res.resultUrl, '_blank').focus()
              }
              else
              {
                loaderResult.dismiss().then();
                console.log("The url is:" + res.resultUrl)
                this.exportPopover(res.resultUrl)
              }


            });

        })
      })


    }
    else if (this.exportFormat == ".SVG")
    {
      const svgData = this.patternService.getCanvasAsSVG(this.canvas)

      const svgBlob = new Blob([svgData], {type: "image/svg+xml;charset=utf-8"});
      const svgUrl = URL.createObjectURL(svgBlob);
      const downloadLink = document.createElement("a");
      downloadLink.href = svgUrl;
      downloadLink.download = "svgFrame";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
    else
    {
      this.frame(); //download as PNG
    }
  }



  exportPopover(downloadURL: string) {
    let popoverReference:  HTMLIonPopoverElement;
    this.popoverController.create({
      component: ExportComponent,
      componentProps: {'downloadURL' : downloadURL},
      translucent: true,
      cssClass: 'smallScreen'
    }).then(resPop => {
      popoverReference = resPop;
      popoverReference.present().then(presentRes => {
        popoverReference.onDidDismiss().then();

      });
    });
  }

  selectedExportOption(event: any) {
    console.log(this.exportFormat);
  }
}
