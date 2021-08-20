
import { Component, OnInit } from '@angular/core';

import { CollectionsServiceService } from '../../services/collections-service.service';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-collection-creator',
  templateUrl: './collection-creator.component.html',
  styleUrls: ['./collection-creator.component.scss'],
})
export class CollectionCreatorComponent implements OnInit {

  collectionForm = new FormGroup({
    name : new FormControl('', [Validators.required]),
    story : new FormControl('', [Validators.required]),
    theme : new FormControl('', [Validators.required]),
  });
  //the collections that get displayed
  //collections: CollectionsInterface;
  statusCode: string;
  colorCodeHex: string;

  constructor(private collectionsService: CollectionsServiceService) { }

  ngOnInit(): void
  {
    //this.getCollections();
    console.log('neqnewcollection');
  }
  processCollectionForm(){
    console.log(this.collectionForm.value);
    ////SEND DATA TO API OR DATABASE
  }

  newCollection(value: string) {
    //this.collectionsService.createNewCollection(value);
    console.log(value);
    // this.collectionsService.createNewCollection(value)                      //this is an asynchronous operation
    //   .subscribe();
  }

  getColorCodes() {
    const colorValue = document.getElementById('color') as HTMLInputElement;
    this.colorCodeHex = 'Color code: ' + colorValue.value;
    console.log(this.colorCodeHex);
  }
}
