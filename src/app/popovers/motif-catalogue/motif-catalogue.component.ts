import { Component, OnInit } from '@angular/core';
import { PopoverController, } from '@ionic/angular';

@Component({
  selector: 'app-motif-catalogue',
  templateUrl: './motif-catalogue.component.html',
  styleUrls: ['./motif-catalogue.component.scss'],
})
export class MotifCatalogueComponent implements OnInit {

  constructor(private popoverController: PopoverController) { }

  ngOnInit() {}

}
