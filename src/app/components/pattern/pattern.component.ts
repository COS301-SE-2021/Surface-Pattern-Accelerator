import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { ExportPopoverComponent } from '../export-popover/export-popover.component';
import { PreviewComponent } from '../preview/preview.component';

@Component({
  selector: 'app-pattern',
  templateUrl: './pattern.component.html',
  styleUrls: ['./pattern.component.scss'],
})
export class PatternComponent implements OnInit {

  showFiller = false;

  title = 'testAngular';
  username: string | undefined;
  spacing: number = 18;
  rotate : string | undefined;
  rotateNum: number = 0;
  scale : string | undefined;
  scaleNum: number = 0.7;

  ngOnInit(){
    document.addEventListener("change", ()=>{

    })
  }


  constructor() {}


}
