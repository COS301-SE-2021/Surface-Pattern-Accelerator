
import { Component, OnInit } from '@angular/core';
import { CollectionsInterface } from '../../Interfaces/collectionsInterface';
import { CollectionsServiceService } from '../../services/collections-service.service';

@Component({
  selector: 'app-collection-creator',
  templateUrl: './collection-creator.component.html',
  styleUrls: ['./collection-creator.component.scss'],
})
export class CollectionCreatorComponent implements OnInit {

  statusCode: string;

  constructor(private collectionsService: CollectionsServiceService) { }

  ngOnInit(): void
  {
    //this.getCollections();
  }

  newCollection(value: string) {
    console.log("new Collection called");
    this.collectionsService.createNewCollection(value)                    //this is an asynchronous operation
      .subscribe();
  }
}
