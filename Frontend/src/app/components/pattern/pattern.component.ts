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
          this.canvas.remove(motifs[i]);//delete all clone motifs that arent selectable
        }
      }
    }

  }


  setPreview(){

    //(<HTMLInputElement>document.getElementById('img')).src = this.canvas.toDataURL();

    let pcan = (<HTMLInputElement>document.getElementById("imgPreview"));//canvas preview
    pcan.height = 200;
    pcan.width = 200;
    pcan.src = this.canvas.toDataURL();




  }

  toggleBackground(e){
    if(e.detail.checked)
    {
      console.log("background enabled");
      this.canvas.backgroundColor = "white";
      (<HTMLInputElement>document.getElementById('patternFrame')).style.backgroundColor = "white";
      this.canvas.renderAll();
    }
    else{
      this.canvas.backgroundColor = null;
      (<HTMLInputElement>document.getElementById('patternFrame')).style.backgroundColor = null;
      this.canvas.renderAll();
    }
    this.canvas.requestRenderAll();
    this.setPreview();
  }



}
