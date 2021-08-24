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
import {IMotifDetailsInterface} from "../../Interfaces/motifDetails.interface"
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
    this.canvas = new fabric.Canvas('patternFrame');
    this.canvas.setHeight(600);
    this.canvas.setWidth(600);
    this.canvas.backgroundColor = "white"

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


  spawnMotifObject(motifObject: motif)
  {
    if (motifObject.obj) //check if object exists
    {
      let objectToSpawn = motifObject.obj;
      objectToSpawn.scaleToHeight(this.canvas.height-100)
        .set({left: this.canvas.width/2, top: this.canvas.height/2})
        .setCoords();
      console.log("Spawn Motif Path")
      objectToSpawn.clone( (clone) => {
        this.canvas.add(clone).renderAll();
       this.canvasMotifs[this.motifCount++] = clone;

        (<HTMLInputElement> document.getElementById("seamlessCheck")).checked = false;
        this.notSeamless();
      })

    }
  }


  newPattern(patternName: string)
  {
    return this.patternService.newPattern(patternName);
  }

  onPatternChange(selectedPatternID: any) {
    console.log(selectedPatternID);
    this.http.post(this.serverAPIURL + '/getFileByID',
      { fileID: selectedPatternID },
      {withCredentials: true
      }).subscribe(fileContent => {
      this.patternContents = fileContent as IPatternContentsInterface;
      console.log(this.patternContents);
      //this.loadPattern(this.patternContents.motifs);

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

}
