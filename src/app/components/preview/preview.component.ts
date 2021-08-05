import { Component, OnInit } from '@angular/core';
import Konva from 'konva';
@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
})
export class PreviewComponent implements OnInit {
  public theContainer = document.querySelectorAll("#can");
  stage! :  Konva.Stage;
  stage1!: Konva.Stage;
  layerr!:Konva.Layer;
  layer1!:Konva.Layer;
  layer2!:Konva.Layer;
  constructor() { }

  ngOnInit() {}

/* In Konva make this a layer */
  addGrid(e) {
    const canvas = <HTMLCanvasElement> document.getElementById('myCanvas');
    const context = canvas.getContext('2d');
    if(e.checked){
      for (var x = 0.5; x < canvas.width; x += 10) {
        context.moveTo(x, 0);
        context.lineTo(x, 381);
      }

      for (var y = 0.5; y < canvas.height; y += 10) {
        context.moveTo(0, y);
        context.lineTo(500, y);
      }



      context.strokeStyle = "rgba(0,0,0,0.1)";
      context.stroke();

    }
    else
    {
      context.clearRect(0,0,canvas.width,canvas.height);
    }

  }


}
