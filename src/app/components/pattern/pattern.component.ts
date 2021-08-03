import { Component, OnInit } from '@angular/core';
import Konva from "konva";

@Component({
  selector: 'app-pattern',
  templateUrl: './pattern.component.html',
  styleUrls: ['./pattern.component.scss'],
})
export class PatternComponent implements OnInit {
  stage!: Konva.Stage;
  layer!: Konva.Layer;

  ngOnInit(){
    let width = window.innerWidth * 0.9;
    let height = window.innerHeight;
    this.stage = new Konva.Stage({
      container: 'container',
      width: width,
      height: height
    });
    this.layer = new Konva.Layer();
    this.stage.add(this.layer);
    //this.addLineListeners();

    const path = new Konva.Path({
      x: 0,
      y: 0,
      data:
        'M0 0h24v24H0V0z',
      fill: 'green',
      scale: {
        x: 10,
        y: 10,
      },
    });

    // add the shape to the layer
    this.layer.add(path);
  }


  constructor() {}


}
