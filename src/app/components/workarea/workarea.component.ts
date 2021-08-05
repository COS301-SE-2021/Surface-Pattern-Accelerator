import { Component, OnInit } from '@angular/core';
import Konva from 'konva';


@Component({
  selector: 'app-workarea',
  templateUrl: './workarea.component.html',
  styleUrls: ['./workarea.component.scss'],
})
export class WorkareaComponent implements OnInit {

  contentScrollActive = true;
  width = 500;
  height = 500;
  rwidth = 800;
  rect = 0;
  check = false;
  canvasData = document.getElementById('myCanvas');
  myFrame = document.getElementById('canvasFrame');//get div of canvas frame
  stage!: Konva.Stage;
  layer!: Konva.Layer;
  constructor() {
  }

  ngOnInit() {
    //document.addEventListener('change', ()=>{

    //});
    const w = this.width;
    const h = this.height;
    this.stage = new Konva.Stage({
      container: 'container',
      width: w,
      height: h
    });
    this.layer = new Konva.Layer();

    const rectX = this.stage.width() / 2 - 50;
    const rectY = this.stage.height() / 2 - 50;
    const box = new Konva.Rect({
      x: rectX,
      y: rectY,
      width: 100,
      height: 100,
      fill: '#00D2FF',
      stroke: 'black',
      strokeWidth: 4,
      draggable: true,
      // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
      dragBoundFunc(pos) {
        let X = pos.x;
        let Y = pos.y;
        const minX = 0;
        const minY = 0;
        const maxX = 400;
        const maxY = 400;
        if(X < minX) {X = minX;}
        if(X > maxX) {X = maxX;}
        if(Y < minY) {Y = minY;}
        if(Y > maxY) {Y = maxY;}
        return {
          x: X,
          y: Y,
        };
      },
    });
//this.absolutePosition().y,
    // add cursor styling
    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
    box.on('mouseover', function() {
      document.body.style.cursor = 'pointer';
    });
    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
    box.on('mouseout', function() {
      document.body.style.cursor = 'default';
    });

    function drawImage(imageOb) {
      // Image
      const img = new Konva.Image({
        image: imageOb,
        x: this.stage.width() / 2 - 200 / 2,
        y: this.stage.height() / 2 - 137 / 2,
        width: 200,
        height: 137,
        draggable: true,
      });
// add cursor styling
      // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
      img.on('mouseover', function() {
        document.body.style.cursor = 'pointer';
      });
      // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
      img.on('mouseout', function() {
        document.body.style.cursor = 'default';
      });
      this.layer.add(this.img);
    }
    const imageObj = new Image();
    imageObj.onload = function() {
      drawImage(this);
    };
    imageObj.src = '/assets/umbrella.jpg';


    this.layer.add(box);
    this.stage.add(this.layer);
    //this.addLineListeners();
  }
  // eslint-disable-next-line @typescript-eslint/member-ordering
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
  chooseCanvasSymbol(check){
    this.myFrame = document.getElementById('canvasFrame');//get div of canvas frame
    if(check===true)//square is alright
    {
      check = true;
      this.width = 500;
      this.height = 500;
      this.changeSize(check);
    }
    else{//rectangle is option
      check=false;
      this.width = 800;
      this.height = 500;
      this.changeSize(check);
    }
  }
  changeSize(check){
    if(check===true)//square is alright
    {
      this.myFrame.style.width = this.width + 40+ 'px';
      this.myFrame.style.height = this.height + 40 + 'px';
    }
    else{//rectangle is option
      this.myFrame.style.width = this.rwidth + 40 + 'px';
      this.myFrame.style.height = this.height + 40 +  'px';
    }
  }
  generateMotif(){
      //simple cloning of layer and adding it to stage
    const rectX = this.stage.width() / 2 - 50;
    const rectY = this.stage.height() / 2 - 50;
    const box = new Konva.Rect({
      x: rectX,
      y: rectY,
      width: 100,
      height: 100,
      fill: '#00D2FF',
      stroke: 'black',
      strokeWidth: 4,
      draggable: true,
      // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
      dragBoundFunc(pos) {
        let X = pos.x;
        let Y = pos.y;
        const minX = 0;
        const minY = 0;
        const maxX = 400;
        const maxY = 400;
        if(X < minX) {X = minX;}
        if(X > maxX) {X = maxX;}
        if(Y < minY) {Y = minY;}
        if(Y > maxY) {Y = maxY;}
        return {
          x: X,
          y: Y,
        };
      },
    });
    // add cursor styling
    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
    box.on('mouseover', function() {
      document.body.style.cursor = 'pointer';
    });
    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
    box.on('mouseout', function() {
      document.body.style.cursor = 'default';
    });
    this.layer.add(box);
    this.stage.add(this.layer);
  }
}
