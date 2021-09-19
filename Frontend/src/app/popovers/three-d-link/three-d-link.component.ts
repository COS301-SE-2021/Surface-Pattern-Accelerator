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

  copyToClipboard(){
    /* Get the text field */
    let copyText = document.getElementById("myInput") as HTMLInputElement;

    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /* For mobile devices */

    /* Copy the text inside the text field */
    navigator.clipboard.writeText(copyText.value);

    /* Alert the copied text */
    alert("Copied the text: " + copyText.value);
  }

}
