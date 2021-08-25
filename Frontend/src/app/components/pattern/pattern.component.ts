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




  //saving patterns in pattern Contents interface




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





  newPattern(patternName: string)
  {
    return this.patternService.newPattern(patternName);
  }

  onPatternChange(selectedPatternID: any) {
    console.log(selectedPatternID);

    for (let motOnCanvas in this.motifService.motifsOnCanvas.objects)
    {
      this.canvas.remove(this.motifService.motifsOnCanvas.objects[motOnCanvas].objectRef)
    }

    this.http.post(this.serverAPIURL + '/getFileByID',
      { fileID: selectedPatternID },
      {withCredentials: true
      }).subscribe(fileContent => {
      this.patternService.patternContents = fileContent as IPatternContentsInterface;
      console.log(this.patternService.patternContents);
      this.motifService.spawnMotifObjectsFromSaveState(this.patternService.patternContents, this.canvas);
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



  moveUp(index: number) {
    console.log("Layer: " + index)
    console.log(this.motifService.motifsOnCanvas.objects[index].objectName)
    if (this.motifService.motifsOnCanvas.objects[index + 1])
    {
      console.log("upper exists")
      const temp = this.motifService.motifsOnCanvas.objects[index + 1];
      this.motifService.motifsOnCanvas.objects[index + 1] = this.motifService.motifsOnCanvas.objects[index]
      this.motifService.motifsOnCanvas.objects[index] = temp;

      for (index; index < this.motifService.motifsOnCanvas.objects.length; index++)
      {
        this.canvas.remove(this.motifService.motifsOnCanvas.objects[index].objectRef)
        this.canvas.add(this.motifService.motifsOnCanvas.objects[index].objectRef).renderAll();
      }
    }
    else
    {
      console.log("is upper")
    }
  }

  moveDown(index: number) {
    console.log("Layer: " + index)
    console.log(this.motifService.motifsOnCanvas.objects[index].objectName)
    if (this.motifService.motifsOnCanvas.objects[index - 1]) {
      console.log("lower exists")
      const temp = this.motifService.motifsOnCanvas.objects[index - 1];                          //
      this.motifService.motifsOnCanvas.objects[index - 1] = this.motifService.motifsOnCanvas.objects[index]   // swap motifs on array
      this.motifService.motifsOnCanvas.objects[index] = temp;                                    //

      for (index; index < this.motifService.motifsOnCanvas.objects.length; index++)
      {
        this.canvas.remove(this.motifService.motifsOnCanvas.objects[index].objectRef)
        this.canvas.add(this.motifService.motifsOnCanvas.objects[index].objectRef).renderAll();
      }
    } else {
      console.log("is lower")
    }
  }
}
