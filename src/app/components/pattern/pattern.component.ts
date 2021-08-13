import { Component, OnInit } from '@angular/core';
import { MotifServiceService } from '../../services/motif-service.service';
import Konva from "konva";
import { Group } from 'konva/lib/Group';
import { Shape, ShapeConfig } from 'konva/lib/Shape';
import {motifsInterface} from "../../Interfaces/motifsInterface";

@Component({
  selector: 'app-pattern',
  templateUrl: './pattern.component.html',
  styleUrls: ['./pattern.component.scss'],
})
export class PatternComponent implements OnInit {
  stage!: Konva.Stage;
  layer2!: Konva.Layer;

  stage1!: Konva.Stage;
  layerr!:Konva.Layer;
  layer1!:Konva.Layer;
  // layer2!:Konva.Layer;
  background!: Konva.Rect;
  previewStage!: Konva.Stage;
  previewLayer!: Konva.Layer;
  motifCount: number = 0;
  motifs?: motifsInterface;
  tr!: Konva.Transformer;
  canvasMotifs:  (Group | Shape)[] = new Array();
  canvasMotifsUrl:  string[] = new Array();
  height: number = 300;//100
  width: number = 300;
  gridLayer? : Konva.Layer;

  //Needed For Undo
  _state: Konva.Layer[] = new Array();

  constructor(private motifService: MotifServiceService) {}

  ngOnInit(){
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
      this.layer2 = ( this._state.pop());
      this.stage1.add(this.layer2);
    }

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
       // console.log(motifs)
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

  spawnMotifWithURL(motifURL: string)
  {

    this.canvasMotifsUrl[this.motifCount] = motifURL;
    Konva.Image.fromURL(motifURL,
      (image: Group | Shape<ShapeConfig>) => {
        image.x(0);
        console.log(motifURL);
        image.scale();
        image.draggable(true);
        console.log( image);


          // image.on('keydown', function(e){
          //   e = e || window.event;
          //   if (e.keyCode === 38) { // up
          //     image.moveUp();
          //     console.log("upppp");
          //   }  else if (e.keyCode === 40) { // down
          //     image.moveDown();
          //   } else {
          //     return;
          //   }
          //   e.preventDefault();
          //
          // })





        this.layer2.add(image);
        this.canvasMotifs[this.motifCount] = image;
       // console.log("New motifs: " + this.layer2);

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
    this.back();

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

  movetToBottom(img: Group | Shape<ShapeConfig>) {
    for (var i = 0; i < this.layer2.children.length; i++) {
      if (img._id + 1 == this.layer2.children[i]._id) {
        this.layer2.children[i].moveToBottom();
        img.moveToBottom();
      }
    }
    //this.back();
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
    if(this.background.fill() == null)
    {
      this.background.fill('darkgrey');
    }
    const color = this.background.fill();//keep old/new color
    this.background = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.stage1.width(),
      height: this.stage1.height(),
      fill: color,
      listening: false,
      resizeEnabled: false,
      draggable: false,

    });
    this.layer2.add(this.background);
    this.background.moveToBottom();
  }

  download(){
    const dataURL = this.stage.toDataURL({ pixelRatio: 3 });//get current canvas
    this.downloadURI(dataURL, 'frame.png');
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
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const color	= (<HTMLInputElement>document.getElementById('fav_color')).value;
    //con.style.backgroundColor = color;
    //this.stage.container().style.backgroundColor = color;
    //alert(color);
    this.background.fill(color);
  }

}
