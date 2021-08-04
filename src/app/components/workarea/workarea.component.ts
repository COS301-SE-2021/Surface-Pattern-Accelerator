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
    document.addEventListener('change', ()=>{

    });
    const w = window.innerWidth * 0.9;
    const h = window.innerHeight;
    this.stage = new Konva.Stage({
      container: 'container',
      width: w,
      height: h
    });
    this.layer = new Konva.Layer();

    const rectX = this.stage.width() / 2 - 50;
    const rectY = this.stage.height() / 2 - 25;

    const box = new Konva.Rect({
      x: rectX,
      y: rectY,
      width: 100,
      height: 50,
      fill: '#00D2FF',
      stroke: 'black',
      strokeWidth: 4,
      draggable: true,
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
    //this.addLineListeners();


  }
  // eslint-disable-next-line @typescript-eslint/member-ordering
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

}
