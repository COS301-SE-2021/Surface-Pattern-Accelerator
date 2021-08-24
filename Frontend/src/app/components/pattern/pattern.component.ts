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
  motifsOnCanvas: {objects: {objectRef: fabric.Object, objectName: string, objectID: string}[]} = {objects: []};



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
      objectToSpawn.clone( (clone: fabric.Object) => { //objectToSpawn is the cached svg in memory. Make clones of this object and then
        this.canvas.add(clone).renderAll(); //the clone is spawned on the canvas
        this.motifsOnCanvas.objects.push({objectRef: clone, objectName: motifObject.motifName, objectID: motifObject.id }); //TODO: create interface
        //console.log(this.motifsOnCanvas.objects[0].objectRef.left)
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
            this.motifsOnCanvas.objects.push({objectRef: clone, objectName: cachedMotTemp.motifName, objectID: cachedMotTemp.id }); //TODO: create interface
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
}
