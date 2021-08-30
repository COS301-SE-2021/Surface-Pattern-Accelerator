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
  scale: number = 6;

  width: number = 600;
  height: number = 600;

  pixel: number = 2;
  opacity: number = 1;
  color: string = "white";
  colorOrginal: string = "white";
  background: boolean = false;

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
    })

    this.getMotifs();
    this.canvas = new fabric.Canvas('patternFrame', { preserveObjectStacking: true });
    this.canvas.setHeight(this.width);
    this.canvas.setWidth(this.height);
    this.canvas.backgroundColor = null;

    this.canvas.on("selection:created",(r) => {
      this.getSelectedObject();
    })

    this.canvas.on("selection:updated",(r) => {
      this.getSelectedObject();
    })

    this.canvas.on("object:moving" ,(r) => {
      if (this.activeObject.hasReflections)
      {
        this.updateReflectionsOfSelected();
        console.log("Moving Reflections");
      }
    })

    this.canvas.on("object:rotating" ,(r) => {
      if (this.activeObject.hasReflections)
      {
        this.updateReflectionsOfSelected();
        console.log("Moving Reflections");
      }
    })

    this.canvas.on("object:scaling" ,(r) => {
      if (this.activeObject.hasReflections)
      {
        this.updateReflectionsOfSelected()
        console.log("Moving Reflections")
      }
    })


    //this.frame = document.getElementById('patternFrame');//get div of workarea

    this.canvasPre = new fabric.Canvas('previewFrame', { preserveObjectStacking: true });
    this.canvasPre.setHeight(this.width);
    this.canvasPre.setWidth(this.height);
    this.canvasPre.backgroundColor = null;

    this.img = new fabric.Image('previewFrame');

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
    this.motifService.getMotifs()
      .then((motifs ) => {
        console.log(motifs )
        console.log("All motifs loaded"); //load motifs can be called here in the future when a pattern gets automatically selected
        this.patternService.onPatternChange(this.patternService.selectedPatternID, this.canvas);
      }) //load motifs

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


  notSeamless(){
    let motifs = this.canvas.getObjects();
   for(var i = 0 ; i < motifs.length ; i++){
     if(motifs[i].selectable === false){
       this.canvas.remove(motifs[i]);
     }
   }

  }

  toggleSeamless(e) {
    if(e.detail.checked )
    {
      let motifs = this.canvas.getObjects();

      for (let i = 0; i < motifs.length; i++) {
        let clone1, clone2, clone3, clone4, clone5, clone6, clone7, clone8;

        motifs[i].clone((o) => {
          clone1 = o;
          this.canvas.add(clone1);
          clone1.set("left",  motifs[i].left - 600);
          clone1.set("top",  motifs[i].top);
          clone1.set("selectable", false);
          clone1.set("opacity", this.opacity);
          this.canvas.renderAll();
        });

        motifs[i].clone((o) => {
          clone2 = o;
          this.canvas.add(clone2);
          clone2.set("left",  motifs[i].left + 600);
          clone2.set("top",  motifs[i].top);
          clone2.set("selectable", false);
          clone2.set("opacity", this.opacity);
          this.canvas.renderAll();
        });

        motifs[i].clone((o) => {
          clone3 = o;
          this.canvas.add(clone3);
          clone3.set("left",  motifs[i].left);
          clone3.set("top",  motifs[i].top - 600);
          clone3.set("selectable", false);
          clone3.set("opacity", this.opacity);
          this.canvas.renderAll();
        });

        motifs[i].clone((o) => {
          clone4 = o;
          this.canvas.add(clone4);
          clone4.set("left",  motifs[i].left);
          clone4.set("top",  motifs[i].top + 600);
          clone4.set("selectable", false);
          clone4.set("opacity", this.opacity);
          this.canvas.renderAll();
        });

        motifs[i].clone((o) => {
          clone5 = o;
          this.canvas.add(clone5);
          clone5.set("left",  motifs[i].left - 600);
          clone5.set("top",  motifs[i].top - 600);
          clone5.set("selectable", false);
          clone5.set("opacity", this.opacity);
          this.canvas.renderAll();
        });

        motifs[i].clone((o) => {
          clone6 = o;
          this.canvas.add(clone6);
          clone6.set("left",  motifs[i].left - 600);
          clone6.set("top",  motifs[i].top + 600);
          clone6.set("selectable", false);
          clone6.set("opacity", this.opacity);
          this.canvas.renderAll();
        });

        motifs[i].clone((o) => {
          clone7 = o;
          this.canvas.add(clone7);
          clone7.set("left",  motifs[i].left + 600);
          clone7.set("top",  motifs[i].top - 600);
          clone7.set("selectable", false);
          clone7.set("opacity", this.opacity);
          this.canvas.renderAll();
        });

        motifs[i].clone((o) => {
          clone8 = o;
          this.canvas.add(clone8);
          clone8.set("left",  motifs[i].left + 600);
          clone8.set("top",  motifs[i].top + 600);
          clone8.set("selectable", false);
          clone8.set("opacity", this.opacity);
          this.canvas.renderAll();
        });

        this.canvas.requestRenderAll();





        let actions = ['moving', 'scaling', 'rotating'];

        motifs[i].on('moving', function(){
          clone1.set("left",  motifs[i].left+600);
          clone1.set("top",  motifs[i].top);
          clone1.set("scaleX",  motifs[i].scaleX);
          clone1.set("scaleY",  motifs[i].scaleY);
          clone1.rotate( motifs[i].angle);
          clone1.set('flipX', motifs[i].flipX);
          clone1.set('flipY', motifs[i].flipY);

          clone2.set("left",  motifs[i].left-600);
          clone2.set("top",  motifs[i].top);
          clone2.set("scaleX",  motifs[i].scaleX);
          clone2.set("scaleY",  motifs[i].scaleY);
          clone2.rotate( motifs[i].angle);
          clone2.set('flipX', motifs[i].flipX);
          clone2.set('flipY', motifs[i].flipY);

          clone3.set("left",  motifs[i].left);
          clone3.set("top",  motifs[i].top+600);
          clone3.set("scaleX",  motifs[i].scaleX);
          clone3.set("scaleY",  motifs[i].scaleY);
          clone3.rotate( motifs[i].angle);
          clone3.set('flipX', motifs[i].flipX);
          clone3.set('flipY', motifs[i].flipY);

          clone4.set("left",  motifs[i].left);
          clone4.set("top",  motifs[i].top-600);
          clone4.set("scaleX",  motifs[i].scaleX);
          clone4.set("scaleY",  motifs[i].scaleY);
          clone4.rotate( motifs[i].angle);
          clone4.set('flipX', motifs[i].flipX);
          clone4.set('flipY', motifs[i].flipY);

          clone5.set("left",  motifs[i].left-600);
          clone5.set("top",  motifs[i].top-600);
          clone5.set("scaleX",  motifs[i].scaleX);
          clone5.set("scaleY",  motifs[i].scaleY);
          clone5.rotate( motifs[i].angle);
          clone5.set('flipX', motifs[i].flipX);
          clone5.set('flipY', motifs[i].flipY);

          clone6.set("left",  motifs[i].left-600);
          clone6.set("top",  motifs[i].top+600);
          clone6.set("scaleX",  motifs[i].scaleX);
          clone6.set("scaleY",  motifs[i].scaleY);
          clone6.rotate( motifs[i].angle);
          clone6.set('flipX', motifs[i].flipX);
          clone6.set('flipY', motifs[i].flipY);

          clone7.set("left",  motifs[i].left+600);
          clone7.set("top",  motifs[i].top-600);
          clone7.set("scaleX",  motifs[i].scaleX);
          clone7.set("scaleY",  motifs[i].scaleY);
          clone7.rotate( motifs[i].angle);
          clone7.set('flipX', motifs[i].flipX);
          clone7.set('flipY', motifs[i].flipY);

          clone8.set("left",  motifs[i].left+600);
          clone8.set("top",  motifs[i].top+600);
          clone8.set("scaleX",  motifs[i].scaleX);
          clone8.set("scaleY",  motifs[i].scaleY);
          clone8.rotate( motifs[i].angle);
          clone8.set('flipX', motifs[i].flipX);
          clone8.set('flipY', motifs[i].flipY);
        })
      }
    }
    else
    {
      let motifs = this.canvas.getObjects();
      for(var i = 0 ; i < motifs.length ; i++){
        if(motifs[i].selectable === false){
          this.canvas.remove(motifs[i]);//delete all clone motifs that arent selectable
        }
      }
    }

  }


  setPreview(){

    //(<HTMLInputElement>document.getElementById('img')).src = this.canvas.toDataURL();

    const pcan = (<HTMLInputElement>document.getElementById("imgPreview"));//canvas preview
    pcan.height = this.height / this.scale;
    pcan.width = this.width / this.scale;
    pcan.src = this.canvas.toDataURL();

    let can = this.canvasPre;
    let con = can.getContext();

    //pcan will be reflected for the preview seamlessly

    con.clearRect(0, 0, this.canvas.width, this.canvas.height);//clear context

    for (let i = 0; i < this.scale; i++)//rows, Y
    {
      for (let j = 0; j < this.scale; j++)//columns, X
      {
        con.drawImage(<CanvasImageSource><unknown>pcan, j * (this.width / this.scale) , i * (this.height / this.scale) , (this.width / this.scale) , (this.height / this.scale));
      }
    }

    //this.refresh();


    const precan = (<HTMLInputElement>document.getElementById("imgPattern"));//canvas preview
    precan.height = this.height;
    precan.width = this.width;
    precan.src = con.canvas.toDataURL();

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
    this.setPreview();
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
      this.setPreview();//refresh preview
    }
    else{
      this.setPreview();//refresh preview
      return;
    }

  }



  scaleCanvas3(){
    this.scale = 3;
    this.setPreview();
  }

  scaleCanvas6(){
    this.scale = 6;
    this.setPreview();
  }

  scaleCanvas9(){
    this.scale = 9;
    this.setPreview();
  }

  seamlessModifier(event: any) {
    console.log(event.detail.checked );
    //TODO: initialize hasReflections to fix error in console when changing from undefined to true/false when check box is ticked
    if (event.detail.checked === true)
    {
      if (this.activeObject.hasReflections)
      {
        return;
      }

      this.activeObject.reflections = [
        this.reflectionCreator(this.activeObject, -this.canvasWidth, +this.canvasHeight),
        this.reflectionCreator(this.activeObject, -this.canvasWidth, 0),
        this.reflectionCreator(this.activeObject, -this.canvasWidth, -this.canvasHeight),
        this.reflectionCreator(this.activeObject, 0, +this.canvasHeight),
        this.reflectionCreator(this.activeObject, 0, -this.canvasHeight),
        this.reflectionCreator(this.activeObject, +this.canvasWidth, +this.canvasHeight),
        this.reflectionCreator(this.activeObject, +this.canvasWidth, 0),
        this.reflectionCreator(this.activeObject, +this.canvasWidth, -this.canvasHeight)
      ]

      this.activeObject.hasReflections = true;

      for (let object = 0; object < this.canvas.getObjects().length; object++)
      {
        if (this.activeObject.IDOnCanvas === this.canvas.getObjects()[object].IDOnCanvas)
        {
          console.log("Found");
          for (let reflection = 0; reflection <  this.activeObject.reflections.length; reflection++)
          {
            this.canvas._objects.splice(object, 0, this.activeObject.reflections[reflection] );
          }
          this.canvas.renderAll();
          return;
        }
      }

    }
    else {
      this.activeObject.hasReflections = false;
      //this.motifsOnCanvas = this.getNonSpecialObjects()

      this.renderAllWithSpecial(this.getNonSpecialObjects());
    }
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
    let withoutSpecial: fabric.Object[] = [];
    for (let obj in objects) //check to make sure no special objects are in this array
    {
      if (objects[obj].IDOnCanvas != undefined)
      {
        withoutSpecial.push(objects[obj]);
      }
    }

    let objectsToRender: fabric.Object[] = [];
    for (let obj in withoutSpecial)
    {
      if (withoutSpecial[obj].hasReflections)
      {
        for(let reflection in withoutSpecial[obj].reflections)
        {
          objectsToRender.push(withoutSpecial[obj].reflections[reflection]);
        }
      }
      objectsToRender.push(withoutSpecial[obj]);
    }
    this.canvas._objects = objectsToRender;
    this.canvas.renderAll();
  }

  reflectionUpdater(reflectionIndex: number, topOffset: number, leftOffset: number)
  {
    const ref = this.activeObject.reflections[reflectionIndex];
    ref.set("top",  this.activeObject.top + topOffset);
    ref.set("left",  this.activeObject.left + leftOffset);
    ref.set("scaleX",  this.activeObject.scaleX);
    ref.set("scaleY",  this.activeObject.scaleY);
    ref.rotate( this.activeObject.angle);
    ref.set('flipX', this.activeObject.flipX);
    ref.set('flipY', this.activeObject.flipY);
  }

  updateReflectionsOfSelected() {

    this.reflectionUpdater(0, -this.canvasWidth, +this.canvasHeight);
    this.reflectionUpdater(1, -this.canvasWidth, 0);
    this.reflectionUpdater(2, -this.canvasWidth, -this.canvasHeight);
    this.reflectionUpdater(3, 0, +this.canvasHeight);
    this.reflectionUpdater(4, 0, -this.canvasHeight);
    this.reflectionUpdater(5, +this.canvasWidth, +this.canvasHeight);
    this.reflectionUpdater(6, +this.canvasWidth, 0);
    this.reflectionUpdater(7, +this.canvasWidth, -this.canvasHeight);
  }




}
