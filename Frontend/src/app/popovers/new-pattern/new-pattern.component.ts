import { Component, OnInit } from '@angular/core';
import {PopoverController} from "@ionic/angular";

@Component({
  selector: 'app-new-pattern',
  templateUrl: './new-pattern.component.html',
  styleUrls: ['./new-pattern.component.scss'],
})
export class NewPatternComponent implements OnInit {

  constructor(private popoverController: PopoverController) { }

  ngOnInit() {}

  saveNewPattern(patternName: string)
  {
    console.log(patternName)
    this.popoverController.dismiss(patternName).then();
  }

}
