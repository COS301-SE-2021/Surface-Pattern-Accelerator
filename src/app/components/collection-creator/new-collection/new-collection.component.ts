import { Component, OnInit } from '@angular/core';
import { CollectionsServiceService } from '../../../services/collections-service.service';

@Component({
  selector: 'app-new-collection',
  templateUrl: './new-collection.component.html',
  styleUrls: ['./new-collection.component.scss'],
})
export class NewCollectionComponent implements OnInit {

  colorCodeHex: string;
  constructor(private collectionsService: CollectionsServiceService) { }

  ngOnInit()
  {
      console.log('new collection component created');
  }

  newCollection(value: string) {
    //this.collectionsService.createNewCollection(value);
    console.log(value);
    this.collectionsService.createNewCollection(value)                      //this is an asynchronous operation
      .subscribe(newCollectionResult => {
        console.log(newCollectionResult);
      });
  }

  getColorCodes() {
    const colorValue = document.getElementById('color') as HTMLInputElement;
    this.colorCodeHex = 'Color code: ' + colorValue.value;
    console.log(this.colorCodeHex);
  }
}
