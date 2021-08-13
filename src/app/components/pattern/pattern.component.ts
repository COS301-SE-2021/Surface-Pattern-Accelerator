import { Component, OnInit } from '@angular/core';
import { MotifServiceService } from '../../services/motif-service.service';
import Konva from "konva";
import { Group } from 'konva/lib/Group';
import { Shape, ShapeConfig } from 'konva/lib/Shape';
import {motifsInterface} from "../../Interfaces/motifsInterface";
import { PatternService } from "../../services/pattern.service";

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pattern',
  templateUrl: './pattern.component.html',
  styleUrls: ['./pattern.component.scss'],
})
export class PatternComponent implements OnInit {
  stage!: Konva.Stage;
  layer!: Konva.Layer;

  motifs?: motifsInterface;

  constructor(private motifService: MotifServiceService, private route: ActivatedRoute, private patternService: PatternService) {}

  ngOnInit(){

    this.route.params.subscribe(params => {
      console.log("params are")
      console.log(params['collectionName'])
      console.log(params['collectionID'])

      this.patternService.getCurrentCollectionJSON(params['collectionID']);


    })

    this.getMotifs();

    let width = 500;
    let height = 500;
    this.stage = new Konva.Stage({
      container: 'container',
      width: width,
      height: height
    });
    this.layer = new Konva.Layer();
    this.stage.add(this.layer);
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

    this.layer.add(path2);
  }

  spawnMotifWithURL(motifURL: string)
  {
    Konva.Image.fromURL(motifURL,
      (image: Group | Shape<ShapeConfig>) => {
        image.x(100);

        image.scale();
        image.draggable(true);
        this.layer.add(image);
      });
  }

  newPattern(patternName: string)
  {
    this.patternService.newPattern(patternName);
    console.log(patternName);
  }



}
