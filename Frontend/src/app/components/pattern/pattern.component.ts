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


@Component({
  selector: 'app-pattern',
  templateUrl: './pattern.component.html',
  styleUrls: ['./pattern.component.scss'],
})
export class PatternComponent implements OnInit {
  private serverAPIURL = 'http://localhost:3000/api';
  selected!:(Group | Shape);
  selectedPattern: any;
  //motifs?: motifsInterface;

  canvas?: fabric.Canvas;
  motifSaveStates: IMotifStateInterface[] = [];
  motifsOnCanvas: {objects: {objectRef: fabric.Object, objectName: string, objectID: string, motifURL: string}[]} = {objects: []};
  motifObjects: motif[] = [];
  canvasMotifs: fabric.Object[] = [];
  seamlessClones: fabric.Object[] = [];
  motifCount: number = 0;


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
    this.canvas = new fabric.Canvas('patternFrame', { preserveObjectStacking: true })
    this.canvas.setHeight(600);
    this.canvas.setWidth(600);
    this.canvas.backgroundColor = null;
    //this.frame = document.getElementById('patternFrame');//get div of workarea

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
      .then(() => {
        console.log("All motifs loaded"); //load motifs can be called here in the future when a pattern gets automatically selected
      }) //load motifs

  }



  @ViewChild('menu') menu!:ElementRef;
  contextMenu(e){
    e.preventDefault();
    if(this.selected != undefined)
    {
      this.menu.nativeElement.style.display = "block";
      this.menu.nativeElement.style.top = e.pageY + "px";
      this.menu.nativeElement.style.left = e.pageX + "px"
    }

  }

  //This functions spawns the motifs on the canvas, its called from the HTML
  spawnMotifObject(motifObject: motif)
  {
    if (motifObject.obj) //check if object exists
    {
      let objectToSpawn = motifObject.obj;
      objectToSpawn.scaleToHeight(this.canvas.height-250) //this is relative? Keep same in both spawn functions******
        .set({left: this.canvas.width/15, top: this.canvas.height/15})
        .setCoords();
      console.log("Spawn Motif Path")
      objectToSpawn.clone( (clone) => {
        this.canvas.add(clone).renderAll();
       this.canvasMotifs[this.motifCount++] = clone;
        this.motifsOnCanvas.objects.push({objectRef: clone, objectName: motifObject.motifName, objectID: motifObject.id, motifURL: motifObject.motifURL}); //TODO: create interface

        (<HTMLInputElement> document.getElementById("seamlessCheck")).checked = false;
        this.notSeamless();
      })
    }
  }

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


            // .set({
            //   left: motStateTemp.left,
            //   top: motStateTemp.top,
            //   angle: motStateTemp.rotation,
            //   height: motStateTemp.height* motStateTemp.scale.scaleY,
            //   width: motStateTemp.width* motStateTemp.scale.scaleX
            // })

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

  onPatternChange(selectedPatternID: any) {
    console.log(selectedPatternID);

    for (let motOnCanvas in this.motifsOnCanvas.objects)
    {
      this.canvas.remove(this.motifsOnCanvas.objects[motOnCanvas].objectRef)
    }


    this.http.post(this.serverAPIURL + '/getFileByID',
      { fileID: selectedPatternID },
      {withCredentials: true
      }).subscribe(fileContent => {
      this.patternContents = fileContent as IPatternContentsInterface;
      console.log(this.patternContents);
      this.spawnMotifObjectsFromSaveState();

    });
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

  savePattern() {
    this.motifSaveStates = [];
    for (let mot in this.motifsOnCanvas.objects)
    {
      //this.motifsOnCanvas.objects[mot].objectRef.
      this.motifSaveStates.push({
        left: this.motifsOnCanvas.objects[mot].objectRef.left,
        top: this.motifsOnCanvas.objects[mot].objectRef.top,
        width: this.motifsOnCanvas.objects[mot].objectRef.getScaledWidth(),
        height: this.motifsOnCanvas.objects[mot].objectRef.getScaledHeight(),
        scale: this.motifsOnCanvas.objects[mot].objectRef.getObjectScaling(),
        rotation: this.motifsOnCanvas.objects[mot].objectRef.angle,
        layer: 0, //Temp
        motifID: this.motifsOnCanvas.objects[mot].objectID,
        motifName: this.motifsOnCanvas.objects[mot].objectName,

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

  moveUp(index: number) {
    console.log("Layer: " + index)
    console.log(this.motifsOnCanvas.objects[index].objectName)
    if (this.motifsOnCanvas.objects[index + 1])
    {
      console.log("upper exists")
      const temp = this.motifsOnCanvas.objects[index + 1];
      this.motifsOnCanvas.objects[index + 1] = this.motifsOnCanvas.objects[index]
      this.motifsOnCanvas.objects[index] = temp;

      for (index; index < this.motifsOnCanvas.objects.length; index++)
      {
        this.canvas.remove(this.motifsOnCanvas.objects[index].objectRef)
        this.canvas.add(this.motifsOnCanvas.objects[index].objectRef).renderAll();
      }
    }
    else
    {
      console.log("is upper")
    }
  }

  moveDown(index: number) {
    console.log("Layer: " + index)
    console.log(this.motifsOnCanvas.objects[index].objectName)
    if (this.motifsOnCanvas.objects[index - 1]) {
      console.log("lower exists")
      const temp = this.motifsOnCanvas.objects[index - 1];                          //
      this.motifsOnCanvas.objects[index - 1] = this.motifsOnCanvas.objects[index]   // swap motifs on array
      this.motifsOnCanvas.objects[index] = temp;                                    //

      for (index; index < this.motifsOnCanvas.objects.length; index++)
      {
        this.canvas.remove(this.motifsOnCanvas.objects[index].objectRef)
        this.canvas.add(this.motifsOnCanvas.objects[index].objectRef).renderAll();
      }
    } else {
      console.log("is lower")
    }
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
          clone1.set("opacity", 0.3);
          this.canvas.renderAll();
        });

        motifs[i].clone((o) => {
          clone2 = o;
          this.canvas.add(clone2);
          clone2.set("left",  motifs[i].left + 600);
          clone2.set("top",  motifs[i].top);
          clone2.set("selectable", false);
          clone2.set("opacity", 0.3);
          this.canvas.renderAll();
        });

        motifs[i].clone((o) => {
          clone3 = o;
          this.canvas.add(clone3);
          clone3.set("left",  motifs[i].left);
          clone3.set("top",  motifs[i].top - 600);
          clone3.set("selectable", false);
          clone3.set("opacity", 0.3);
          this.canvas.renderAll();
        });

        motifs[i].clone((o) => {
          clone4 = o;
          this.canvas.add(clone4);
          clone4.set("left",  motifs[i].left);
          clone4.set("top",  motifs[i].top + 600);
          clone4.set("selectable", false);
          clone4.set("opacity", 0.3);
          this.canvas.renderAll();
        });

        motifs[i].clone((o) => {
          clone5 = o;
          this.canvas.add(clone5);
          clone5.set("left",  motifs[i].left - 600);
          clone5.set("top",  motifs[i].top - 600);
          clone5.set("selectable", false);
          clone5.set("opacity", 0.3);
          this.canvas.renderAll();
        });

        motifs[i].clone((o) => {
          clone6 = o;
          this.canvas.add(clone6);
          clone6.set("left",  motifs[i].left - 600);
          clone6.set("top",  motifs[i].top + 600);
          clone6.set("selectable", false);
          clone6.set("opacity", 0.3);
          this.canvas.renderAll();
        });

        motifs[i].clone((o) => {
          clone7 = o;
          this.canvas.add(clone7);
          clone7.set("left",  motifs[i].left + 600);
          clone7.set("top",  motifs[i].top - 600);
          clone7.set("selectable", false);
          clone7.set("opacity", 0.3);
          this.canvas.renderAll();
        });

        motifs[i].clone((o) => {
          clone8 = o;
          this.canvas.add(clone8);
          clone8.set("left",  motifs[i].left + 600);
          clone8.set("top",  motifs[i].top + 600);
          clone8.set("selectable", false);
          clone8.set("opacity", 0.3);
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
          this.canvas.remove(motifs[i]);
        }
      }
    }

  }


  setPreview(){
    (<HTMLInputElement>document.getElementById('img')).src = this.canvas.toDataURL();
  }



}
