import { Component, OnInit } from '@angular/core';
import {MotifServiceService} from "../../services/motif-service.service";
import {ActivatedRoute} from "@angular/router";
import {PatternService} from "../../services/pattern.service";
import {PopoverController} from "@ionic/angular";
import {HttpClient} from "@angular/common/http";
import {fabric} from "fabric";

@Component({
  selector: 'app-motif-editor',
  templateUrl: './motif-editor.component.html',
  styleUrls: ['./motif-editor.component.scss'],
})
export class MotifEditorComponent implements OnInit {
  selectedPattern: any;
  canvas?: fabric.Canvas;


  constructor(public motifService: MotifServiceService,
              private route: ActivatedRoute,
              public patternService: PatternService,
              private popoverController: PopoverController,
              private http: HttpClient) { }

  ngOnInit() {
    this.canvas = new fabric.Canvas('patternFrame_MotifEditor', { preserveObjectStacking: true })
    this.patternService.onPatternChange(this.patternService.selectedPatternID, this.canvas);
  }



  newPatternPopover() {

  }

  openTab($event: any, modifiers: string) {

  }



}
