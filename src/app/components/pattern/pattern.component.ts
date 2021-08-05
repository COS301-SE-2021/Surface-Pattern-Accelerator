import { Component, OnInit } from '@angular/core';
import { MotifServiceService } from '../../services/motif-service.service';
import Konva from "konva";
import {motifsInterface} from "../../Interfaces/motifsInterface";

@Component({
  selector: 'app-pattern',
  templateUrl: './pattern.component.html',
  styleUrls: ['./pattern.component.scss'],
})
export class PatternComponent implements OnInit {
  stage!: Konva.Stage;
  layer!: Konva.Layer;

  motifs?: motifsInterface;

  constructor(private motifService: MotifServiceService) {}

  ngOnInit(){

    this.getMotifs();

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
      draggable: true
    });

    // add the shape to the layer
    this.layer.add(path);
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



}
