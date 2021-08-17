import { Component, OnInit } from '@angular/core';
import { MotifServiceService } from '../../services/motif-service.service';
import Konva from "konva";
import { Group } from 'konva/lib/Group';
import { Shape, ShapeConfig } from 'konva/lib/Shape';
import {motifsInterface} from "../../Interfaces/motifsInterface";
import { PatternService } from "../../services/pattern.service";
import {MotifCatalogueComponent} from "../../popovers/motif-catalogue/motif-catalogue.component"
import {MotifUploadComponent} from "../../popovers/motif-upload/motif-upload.component"
import {IPatternContentsInterface} from "../../Interfaces/patternContents.interface"
import {HttpClient} from "@angular/common/http";


import { ActivatedRoute } from '@angular/router';
import {IMotifDetailsInterface} from "../../Interfaces/motifDetails.interface"
import {PopoverController} from "@ionic/angular";
import {ICollectionsContent} from "../../Interfaces/collectionContents.interface";
@Component({
  selector: 'app-pattern',
  templateUrl: './pattern.component.html',
  styleUrls: ['./pattern.component.scss'],
})
export class PatternComponent implements OnInit {
  private serverAPIURL = 'http://localhost:3000/api';

  selectedPattern: any;

  stage!: Konva.Stage;
  layer2!: Konva.Layer;

  stage1!: Konva.Stage;
  layerr!:Konva.Layer;
  layer1!:Konva.Layer;
  // layer2!:Konva.Layer;
  background!: Konva.Rect;
  previewStage!: Konva.Stage;
  previewLayer!: Konva.Layer;
  downStage!: Konva.Stage;
  downLayer!: Konva.Layer;

  motifCount: number = 0;
  motifs?: motifsInterface;
  tr!: Konva.Transformer;
  canvasMotifs:  (Group | Shape)[] = new Array();
  canvasMotifsUrl:  string[] = new Array();
  height: number = 300;//100
  width: number = 300;

  defHeight: number = 600;
  defWidth: number = 600;
  gridLayer? : Konva.Layer;

  check: boolean = false;
  defaultBack: string = "#878787";//default background color

  //Needed For Undo
  _state: Konva.Layer[] = new Array();


  //Needed for Saving pattern
  motifDetailsTestArr: IMotifDetailsInterface[] = [] ;
  //saving patterns in pattern Contents interface
  patternContents: IPatternContentsInterface = {patternName: "Test Pattern", patternID: "1000", motifs: []} as IPatternContentsInterface;

  //constructor(private motifService: MotifServiceService, private route: ActivatedRoute, public patternService: PatternService) {}

  constructor(private motifService: MotifServiceService,
              private route: ActivatedRoute,
              public patternService: PatternService,
              private popoverController: PopoverController,
              private http: HttpClient) {}


  ngOnInit(){

    //gets the requested Collections ID in the path
    this.route.params.subscribe(params => {
      console.log("params are")
      console.log(params['collectionName'])
      console.log(params['collectionID'])

      this.patternService.getCurrentCollectionJSON(params['collectionID']);


    })

    this.getMotifs();
    type motifOffset=
      {
        motif: Konva.Layer;
        xOffset: number;
        yOffset: number;
      }
    //new preview frame
    let width = 300;
    let height = 300;
    this.stage1 = new Konva.Stage({
      container: 'container',
      width: width,
      height: height
    });
    this.layer2 = new Konva.Layer();

    this.stage = new Konva.Stage({
      container: 'can',   // id of container <div>
      width: 600,//600
      height: 600//600
    });

    let layerr = new Konva.Layer();
    layerr = this.layer2.clone();
    this.stage.add(layerr);

    //set up stage for background
    this.downStage = new Konva.Stage({
      container: 'down',   // id of container <div>
      width: 600,//600
      height: 600//600
    });

    this.downLayer = this.layer2.clone();
    this.downStage.add(this.downLayer);

    this.stage1.add(this.layer2);
    //this.addLineListeners();
    this.gridLayer = new Konva.Layer();

    // create smaller preview stage
    this.previewStage = new Konva.Stage({
      container: 'preview',
      width: this.stage1.width() / 3,
      height: this.stage1.width() / 3,
      scaleX: 1 / 3,
      scaleY: 1 / 3,
    });

    //Needed For Undo
    this.addState();



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
  //Needed For Undo
  addState(_state: Konva.Layer[] = this._state, layer2: Konva.Layer = this.layer2 )
  {
    document.getElementById('container').addEventListener(
      'click',
      function () {
        _state.push(layer2.clone());
      },
      false
    );

  }
  //Needed For Undo
  backButton()
  {
    if(this._state.length != 0)
    {
      this.stage1.removeChildren();
      this.layer2 = ( this._state.pop());//REMOVES TRANSFORMER
      this.stage1.add(this.layer2);
    }

    // const path = new Konva.Path({
    //   x: 0,
    //   y: 0,
    //   data:
    //     'M0 0h24v24H0V0z',
    //   fill: 'green',
    //   scale: {
    //     x: 10,
    //     y: 10,
    //   },
    //   draggable: true
    // });
    //
    // // add the shape to the layer
    // this.layer.add(path);
  }
  savePattern()
  {
    console.log("Layer is: ");
    console.log(this.layer2);
    let count = 0;
    this.patternContents.motifs = [];
    for(let i = 0 ; i < this.layer2.children.length ; i++)
    {

      if(i%2 == 0)
      {
        let motifDetailsTest: IMotifDetailsInterface = {xCoord:0, yCoord:0, scaleX:0, scaleY:0, rotation:0, url:null};
        motifDetailsTest.xCoord = this.layer2.children[i].attrs.x;
        motifDetailsTest.yCoord = this.layer2.children[i].attrs.y;
        motifDetailsTest.scaleX = this.layer2.children[i].attrs.scaleX;
        motifDetailsTest.scaleY = this.layer2.children[i].attrs.scaleY;
        motifDetailsTest.rotation = this.layer2.children[i].attrs.rotation;
        motifDetailsTest.url = this.layer2.children[i].attrs.image.currentSrc;

        //this.motifDetailsTestArr[count++] = motifDetailsTest;
        this.patternContents.motifs.push(motifDetailsTest);
      }
    }
    console.log("Pattern Saved!");
    //console.log(this.motifDetailsTestArr);
    console.log(this.patternContents);

    this.http.post(this.serverAPIURL + '/updateFile', //updates Collection File
      { fileID: this.patternContents.patternID, content: JSON.stringify(this.patternContents) },
      {withCredentials: true
      }).subscribe(patternUpdateResult => {
      console.log(patternUpdateResult) //prints
    })

    // this.loadPattern(this.motifDetailsTestArr)
  }

  loadPattern(motifDetailsArr : IMotifDetailsInterface[])
  {
    console.log(motifDetailsArr);
    //console.log(motifDetailsArr);
    for(let i = 0 ; i < motifDetailsArr.length ; i++)
    {
      console.log("Spawning");
      this.spawnMotifWithURL(motifDetailsArr[i].url, motifDetailsArr[i].xCoord,motifDetailsArr[i].yCoord,motifDetailsArr[i].scaleX,motifDetailsArr[i].scaleY,motifDetailsArr[i].rotation);

      console.log("Next");
    }
    console.log("DONE");
    // for(var i = 0 ; i < motifDetailsArr.length ; i++)
    // {
    //   console.log(motifDetailsArr[i].xCoord);
    //   this.layer2.children[i*2].x(motifDetailsArr[i].xCoord);
    //   this.layer2.children[i*2].attrs.y = motifDetailsArr[i].yCoord;
    //   this.layer2.children[i*2].attrs.scaleX = motifDetailsArr[i].scaleX;
    //   this.layer2.children[i*2].attrs.scaleY = motifDetailsArr[i].scaleY;
    //   this.layer2.children[i*2].attrs.rotation = motifDetailsArr[i].rotation;
    // }
  }


  addGrid(e) {
    console.log(this.layer2);
    var padding = 20;
    if(e.checked){

      for (var i = 0; i < this.width / padding; i++) {
        this.gridLayer.add(new Konva.Line({
          points: [Math.round(i * padding) , 0, Math.round(i * padding) , this.height],
          stroke: 'black',
          strokeWidth: 0.5,
        }));
      }

      this.gridLayer.add(new Konva.Line({points: [0,0,10,10]}));
      for (var j = 0; j < this.height / padding; j++) {
        this.gridLayer.add(new Konva.Line({
          points: [0, Math.round(j * padding), this.width, Math.round(j * padding)],
          stroke: 'black',
          strokeWidth: 0.5,
        }));
      }
      this.stage1.add(this.gridLayer);

    }
    else
    {
      this.gridLayer.remove();
    }
    console.log(this.layer2);

  }
  getMotifs(): void
  {
    this.motifService.getMotifs()
      .subscribe(motifs =>
      {

        this.motifs = motifs
        console.log(motifs)
      });
  }

  spawnMotif()
  {
    const path2 = new Konva.Path({
      x: 0,
      y: 0,
      data:
        '"M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm2 16H5V5h11.17L19 7.83V19zm-7-7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM6 6h9v4H6z',
      fill: 'red',
      scale: {
        x: 2,
        y: 2,

      },
      draggable: true
    });

    this.layer2.add(path2);
  }

  spawnMotifWithURL(motifURL: string, xCoord: number=0, yCoord: number=0, scaleX: number=1, scaleY:number=1, rotation: number=0)
  {

    this.canvasMotifsUrl[this.motifCount] = motifURL;
    Konva.Image.fromURL(motifURL,
      (image: Group | Shape<ShapeConfig>) => {
        image.x(xCoord);
        image.y(yCoord);
        image.scaleX(scaleX);
        image.scaleY(scaleY);
        image.rotation(rotation);
        console.log(motifURL);
        image.scale();
        image.draggable(true);
        console.log( image);

        this.layer2.add(image);
        this.canvasMotifs[this.motifCount] = image;

        this.tr = new Konva.Transformer();
        this.layer2.add(this.tr);

        if(this.motifCount == 0)
        {
          this.tr.nodes([this.layer2.children[this.motifCount]]);
        }
        else
        {
          this.tr.nodes([this.layer2.children[this.motifCount*2]]);
        }

        this.motifCount++;
        console.log(this.layer2);

      });
    //this.back();

    //Needed For Undo
    this.addState();
  }


  moveUp(img: Group | Shape<ShapeConfig>)
  {
    console.log(this.layer2.children);
    for(var i = 0 ; i < this.layer2.children.length; i++)
    {
      if(img._id+1 == this.layer2.children[i]._id && (i-2)<this.layer2.children.length)
      {
        img.moveUp();
        this.layer2.children[i].moveUp();

      }
    }
    //this.back();
  }
  moveDown(img: Group | Shape<ShapeConfig>)
  {
    for(var i = 0 ; i < this.layer2.children.length; i++)
    {
      if(img._id == this.layer2.children[i]._id && (i-2)<this.layer2.children.length)
      {
        img.moveDown();
        this.layer2.children[i+1].moveDown();

      }
    }
    //this.back();
  }

  moveToTop(img: Group | Shape<ShapeConfig>) {
    for (var i = 0; i < this.layer2.children.length; i++) {
      if (img._id + 1 == this.layer2.children[i]._id) {
        this.layer2.children[i].moveToTop();
        img.moveToTop();
      }
    }
    //this.back();
  }

  moveToBottom(img: Group | Shape<ShapeConfig>) {
    for (var i = 0; i < this.layer2.children.length; i++) {
      if (img._id + 1 == this.layer2.children[i]._id) {
        this.layer2.children[i].moveToBottom();
        img.moveToBottom();
      }
    }
    //this.back();
  }
  delete(img: Group | Shape<ShapeConfig>)
  {
    let motifNum = 0;
    for (var i = 0; i < this.layer2.children.length; i++) {
      console.log("Before delete");
      console.log(this.layer2);
      if (img._id == this.layer2.children[i]._id) {
        this.layer2.children[i].remove();
        console.log(this.layer2);
        this.layer2.children[i].remove();
        console.log(this.layer2);
        console.log("Done");
        this.motifCount--;
        this.layer2.draw();
        motifNum = i;
        break;
      }

    }

    let s = document.querySelectorAll(".MotifImage2");
    s[motifNum].remove();
    console.log(s);
    console.log("Is the s");
  }
  flipX(img: Group | Shape<ShapeConfig>)
  {
    for (var i = 0; i < this.layer2.children.length; i++) {
      if (img._id == this.layer2.children[i]._id) {
        this.layer2.children[i].offsetX( this.layer2.children[i].width() / 2)
        this.layer2.children[i].scaleX( (- this.layer2.children[i].scaleX()))
      }

    }
  }
  flipY(img: Group | Shape<ShapeConfig>)
  {
    for (var i = 0; i < this.layer2.children.length; i++) {
      if (img._id == this.layer2.children[i]._id) {
        this.layer2.children[i].offsetY( this.layer2.children[i].height() / 2)
        this.layer2.children[i].scaleY( (- this.layer2.children[i].scaleY()))
      }
    }
  }


  generate()
  {
    this.preview();//refresh and scale workarea


    this.layer1 = null;
    this.layerr = null;
    this.stage = new Konva.Stage({
      container: 'can',
      width: 600,
      height: 600,
      scaleX: 1 / 3,
      scaleY: 1 / 3,
    });

    this.layerr = this.previewLayer.clone();//previewLayer replaced Layer2
    //console.log("Here: " + this.layer2);
    // var one = this.layerr.children[0].clone();
    // var two = this.layerr.children[1].clone();



    // // var three = layerr.children[2].clone();
    //
    var xOffset1 = 0;
    var yOffset1 = 0;
    var xOffset2 = 0;
    var yOffset2 = 0;

    // if(one.attrs.x > 80  ) xOffset1 = one.attrs.x - 100;
    // if(one.attrs.y > 80  ) yOffset1 = one.attrs.y - 100;
    // if(two.attrs.x > 80 ) xOffset2 = two.attrs.x - 100;
    // if(two.attrs.y > 80  ) xOffset2 = two.attrs.y - 100;
    // if(three.attrs.x > 80 ) xOffset3 = three.attrs.x - 100;
    // if(three.attrs.y > 80  ) xOffset3 = three.attrs.y - 100;
    //
    //
    let l = 100;
    let xx = 0;
    for(var i = 0 ; i < 10;i++)//10 became 6
    {
      xx = 0;
      for(var n = 0 ; n < 10 ; n++)
      {
        for(var motifs = 0 ; motifs < this.previewLayer.children.length ; motifs++){
          var k = this.layerr.children[motifs].clone();
          //var one = layerr.children[0].clone();
          k.attrs.x =k.attrs.x + 300 * i - 300;//100
          k.attrs.y = k.attrs.y + 300 * xx - 300;
          this.layerr.add(k);
        }
        xx++;
      }
    }
    this.stage.add(this.layerr);
    this.downLayer = this.layerr;//send to download layer
    //this.background.listening(false);
  }

  preview(){
    this.previewStage = new Konva.Stage({
      container: 'preview',
      width: this.stage1.width() / 3,
      height: this.stage1.width() / 3,
      scaleX: 1 / 3,
      scaleY: 1 / 3,
    });
    //clone frame of pattern stage
    this.previewLayer = this.layer2.clone({ listening: false });
    this.previewStage.add(this.previewLayer);//added clone layer to preview stage
  }
  back(){
    const c = document.getElementById("container").style.backgroundColor;
    //const color = this.background.fill();//keep old/new color
    this.background = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.stage1.width(),
      height: this.stage1.height(),
      fill: c,
      listening: false,
      resizeEnabled: false,
      draggable: false,

    });
    this.layer2.add(this.background);
    this.background.moveToBottom();
  }

  createBack(){
    const c = document.getElementById("container").style.backgroundColor;
    //const color = this.background.fill();//keep old/new color
    this.background = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.defWidth,
      height: this.defHeight,
      scaleY: 3,
      scaleX: 3,
      fill: c,
      listening: false,
      resizeEnabled: false,
      draggable: false,
    });
    this.downStage = this.stage.clone();
    this.downLayer.add(this.background);//add background Rect
    this.background.moveToBottom();//move to bottom of pattern
    this.downStage.add(this.downLayer);//add to downStage
    this.generate();//reset preview
    //this.downStage = new Konva.Stage({
    //   container: 'down',   // id of container <div>
    //   width: 600,
    //   height: 600
    // });
    // this.generate();//refresh preview
    // //this.downLayer = this.layer2.clone();//get copy of preview
    // this.downLayer.add(this.background);//add background Rect
    // this.background.moveToBottom();//move to bottom of pattern
    // this.downStage.add(this.downLayer);//add to downStage

  }

  newPattern(patternName: string)
  {
    this.patternService.newPattern(patternName);
    console.log(patternName);
  }


  download(){
    if(this.check === true)
    {
      this.createBack();
      const dataURL = this.downStage.toDataURL({ pixelRatio: 3 });//get current canvas
      this.downloadURI(dataURL, 'pattern.png');
    }
    else{
      const dataURL = this.stage.toDataURL({ pixelRatio: 3 });//get current canvas
      this.downloadURI(dataURL, 'pattern.png');
    }
  }
  // eslint-disable-next-line prefer-arrow/prefer-arrow-functions

  downloadURI(uri, name) {
    const link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    //delete this.link;
  }
  changeColor()
  {
    const con	= document.getElementById('container');
    const color	= (<HTMLInputElement>document.getElementById('fav_color')).value;
    document.getElementById("container").style.backgroundColor = color;
    document.getElementById("can").style.backgroundColor = color;
    //this.back();
    //this.background.fill(color);
  }

  addBack(e)
  {
    if(e.checked)
    {
      this.check = true;
    }
    else{
      this.check = false;
    }
  }

  onPatternChange(selectedPatternID: any) {
    console.log(selectedPatternID);
    this.http.post(this.serverAPIURL + '/getFileByID',
      { fileID: selectedPatternID },
      {withCredentials: true
      }).subscribe(fileContent => {
      this.patternContents = fileContent as IPatternContentsInterface;
      console.log(this.patternContents);
      this.loadPattern(this.patternContents.motifs);

    });
  }
}
