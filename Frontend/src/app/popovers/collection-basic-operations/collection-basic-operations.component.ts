import { Component, OnInit } from '@angular/core';
import { PopoverController, } from '@ionic/angular';

@Component({
  selector: 'app-collection-basic-operations',
  templateUrl: './collection-basic-operations.component.html',
  styleUrls: ['./collection-basic-operations.component.scss'],
})
export class CollectionBasicOperationsComponent implements OnInit {

  constructor(private popoverController: PopoverController) { }

  ngOnInit() {}

}
