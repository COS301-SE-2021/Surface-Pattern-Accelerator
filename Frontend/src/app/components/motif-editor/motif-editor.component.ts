import { Component, OnInit } from '@angular/core';
import {MotifServiceService} from "../../services/motif-service.service";
import {ActivatedRoute} from "@angular/router";
import {PatternService} from "../../services/pattern.service";
import {PopoverController} from "@ionic/angular";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-motif-editor',
  templateUrl: './motif-editor.component.html',
  styleUrls: ['./motif-editor.component.scss'],
})
export class MotifEditorComponent implements OnInit {
  selectedPattern: any;

  constructor(public motifService: MotifServiceService,
              private route: ActivatedRoute,
              public patternService: PatternService,
              private popoverController: PopoverController,
              private http: HttpClient) { }

  ngOnInit() {}

  onPatternChange(selectedPattern: any) {

  }

  newPatternPopover() {

  }

  openTab($event: any, modifiers: string) {

  }

  uploadFilePopover() {

  }

  collectionCataloguePopover() {

  }
}
