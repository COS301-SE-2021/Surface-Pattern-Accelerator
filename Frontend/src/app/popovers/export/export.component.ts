import {Component, Input, OnInit} from '@angular/core';
import {LoadingController, PopoverController} from '@ionic/angular';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss'],
})
export class ExportComponent implements OnInit {

  @Input() downloadURL: string;

  constructor(private popoverController: PopoverController) { }

  ngOnInit() {}

  closePopover(){
    this.popoverController.dismiss();
  }



}
