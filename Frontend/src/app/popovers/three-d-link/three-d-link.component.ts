import { Component, OnInit } from '@angular/core';
import {PopoverController} from "@ionic/angular";

@Component({
  selector: 'app-three-d-link',
  templateUrl: './three-d-link.component.html',
  styleUrls: ['./three-d-link.component.scss'],
})
export class ThreeDLinkComponent implements OnInit {

  constructor(private popoverController: PopoverController) { }

  imageName: string;

  ngOnInit(): void {
  }

  goTo3DView() {
    this.popoverController.dismiss()
  }

  closePopover(){
    this.popoverController.dismiss();
  }
}
