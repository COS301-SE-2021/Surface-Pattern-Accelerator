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

  ///search
  items = [{ name: "archie" }, { name: "jake" }, { name: "richard" }];
  values = [];
  searchableMotifs=[]


  @ViewChild("parent") private parentRef: ElementRef<HTMLElement>;

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

    this.canvas.on("selection:created",(r) => {
      this.getSelectedObject()
    })

    this.canvas.on("selection:updated",(r) => {
      this.getSelectedObject()
    })


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
      .then((motifs ) => {
        console.log(motifs )
        console.log("All motifs loaded"); //load motifs can be called here in the future when a pattern gets automatically selected
        this.patternService.onPatternChange(this.patternService.selectedPatternID, this.canvas);
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


  listCanvasObjects() {
    console.log(this.canvas.getObjects());
  }

  getSelectedObject()
  {
    //TODO: do this only when in color editor mode/ polygon mode
    console.log(this.canvas.getObjects())
    for (let obj in this.canvas.getObjects())
    {
      this.motifService.motifsOnCanvas.objects[obj].objectRef = this.canvas.getObjects()[obj]
    }

    let object = this.canvas.getActiveObject();



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




  /////for seacrh  ---------- delete
  // getMotifsSearch(): void
  // {
  //   this.motifService.getMotifs()
  //     .subscribe(motifs =>
  //     {
  //       this.searchableMotifs=motifs.motifDetails
  //       this.motifs = motifs
  //       console.log("motifs")
  //       console.log(motifs)
  //     });
  // }



}
