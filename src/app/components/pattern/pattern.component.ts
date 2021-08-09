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
  motifCount: number = 0;
  motifs?: motifsInterface;
  tr!: Konva.Transformer;
  canvasMotifs:  (Group | Shape)[] = new Array();
  canvasMotifsUrl:  string[] = new Array();

  constructor(private motifService: MotifServiceService) {}

  ngOnInit(){

    this.getMotifs();
    type motifOffset=
    {
      motif: Konva.Layer;
      xOffset: number;
      yOffset: number;
    }

    let width = 100;
    let height = 100;
    this.stage1 = new Konva.Stage({
      container: 'container',
      width: width,
      height: height
    });
    this.layer2 = new Konva.Layer();

    this.stage = new Konva.Stage({
      container: 'can',   // id of container <div>
      width: 600,
      height: 600
    });
    let layerr = new Konva.Layer();
    layerr = this.layer2.clone();
    this.stage.add(layerr);
    this.stage1.add(this.layer2);
    //this.addLineListeners();

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
  }

  moveToTop(img: Group | Shape<ShapeConfig>) {
    for (var i = 0; i < this.layer2.children.length; i++) {
      if (img._id + 1 == this.layer2.children[i]._id) {
        this.layer2.children[i].moveToTop();
        img.moveToTop();
      }
    }
  }

  movetToBottom(img: Group | Shape<ShapeConfig>) {
    for (var i = 0; i < this.layer2.children.length; i++) {
      if (img._id + 1 == this.layer2.children[i]._id) {
        this.layer2.children[i].moveToBottom();
        img.moveToBottom();
      }
    }
  }


    generate()
  {
    this.layer1 = null;
    this.layerr = null;
    this.stage = new Konva.Stage({
      container: 'can',
      width: 600,
      height: 600,
    });

     this.layerr = this.layer2.clone();
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
    for(var i = 0 ; i < 10;i++)
    {

      xx = 0;
      for(var n = 0 ; n < 10 ; n++)
      {
        for(var motifs = 0 ; motifs < this.layer2.children.length ; motifs++){
          var k = this.layerr.children[motifs].clone();
          //var one = layerr.children[0].clone();
          k.attrs.x =k.attrs.x + 100 * i - 100;
          k.attrs.y = k.attrs.y + 100 * xx - 100;
          this.layerr.add(k);

        }
        xx++;
      }


    }
    this.stage.add(this.layerr);


  }



}
