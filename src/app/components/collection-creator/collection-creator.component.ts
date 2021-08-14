import { FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CollectionsInterface } from '../../Interfaces/collectionsInterface';
import { CollectionsServiceService } from '../../services/collections-service.service';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup } from '@angular/forms';
import {NewCollectionComponent} from './new-collection/new-collection.component'
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
    this.collectionsService.createNewCollection(value)                      //this is an asynchronous operation
      .subscribe();
  }
}
