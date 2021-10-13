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

  ngOnInit() {
    this.stage1 = new Konva.Stage({
      container: 'container',
      width: 100,
      height: 100

    });

    this.layer2 = new Konva.Layer();
    // create our shape
    let circle = new Konva.Circle({
      x: this.stage1.width() / 2,
      y: this.stage1.height() / 2,
      radius: 10,
      fill: 'red',
      stroke: 'black',
      strokeWidth: 4
    });

    let circle1 = new Konva.Circle({
      x: this.stage1.width() / 2,
      y: this.stage1.height() / 2,
      radius: 20,
      fill: 'red',
      stroke: 'black',
      strokeWidth: 1
    });

    circle.draggable(true);
    circle1.draggable(true);

    this.layer2.add(circle);
    this.layer2.add(circle1);


    var tr = new Konva.Transformer();
    this.layer2.add(tr);
    tr.nodes([circle]);

    var tr2 = new Konva.Transformer();
    this.layer2.add(tr2);
    tr2.nodes([circle1]);

    let layerr = new Konva.Layer();
    for(var i = 0 ; i < this.theContainer.length; i++)
    {
      this.stage = new Konva.Stage({
        container: 'can',   // id of container <div>
        width: 600,
        height: 600
      });

      layerr = this.layer2.clone();
      this.stage.add(layerr);
    }

    layerr = this.layer2.clone();

    this.stage1.add(this.layer2);

  }

// Konva Code
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
    var one = this.layerr.children[0].clone();
    var two = this.layerr.children[1].clone();
    // var three = layerr.children[2].clone();

    var xOffset1 = 0;
    var yOffset1 = 0;
    var xOffset2 = 0;
    var yOffset2 = 0;

    if(one.attrs.x > 80  ) xOffset1 = one.attrs.x - 100;
    if(one.attrs.y > 80  ) yOffset1 = one.attrs.y - 100;
    if(two.attrs.x > 80 ) xOffset2 = two.attrs.x - 100;
    if(two.attrs.y > 80  ) xOffset2 = two.attrs.y - 100;


    let l = 100;
    let xx = 0;
    for(var i = 0 ; i < 10;i++)
    {

      xx = 0;
      for(var n = 0 ; n < 10 ; n++)
      {
        var k = this.layerr.children[0].clone();
        k.attrs.x = k.attrs.x + 100*i + xOffset1 - 100;
        k.attrs.y = k.attrs.y + 100*xx + yOffset1 - 100;
        this.layerr.add(k);

        var m = this.layerr.children[1].clone();
        m.attrs.x = m.attrs.x + 100*i + xOffset2 - 100;
        m.attrs.y = m.attrs.y + 100*xx +  yOffset2 - 100;
        this.layerr.add(m);

        var g = this.layerr.children[2].clone();
        g.attrs.x = g.attrs.x + 100*i + xOffset2 - 100;
        g.attrs.y = g.attrs.y + 100*xx +  yOffset2 - 100;
        this.layerr.add(g);

        xx++;

      }
    }
    this.stage.add(this.layerr);
  }
}
