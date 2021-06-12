import { Component, OnInit } from '@angular/core';
import { CollectionsInterface } from '../../Interfaces/collectionsInterface';
import { CollectionsServiceService } from '../../services/collections-service.service';

@Component({
  selector: 'app-collection-creator',
  templateUrl: './collection-creator.component.html',
  styleUrls: ['./collection-creator.component.scss'],
})
export class CollectionCreatorComponent implements OnInit {

  //the collections that get displayed
  //collections: CollectionsInterface;

  statusCode: string;

  constructor(private collectionsService: CollectionsServiceService) { }

  //this func gets called each time this component gets initialized
  // getCollections(): void
  // {
  //   this.collectionsService.getCollections()                      //this is an asynchronous operation
  //     .subscribe(collections => this.collections = collections);  //observable
  // }

  //add a new collection
  // add(name: string): void {
  //   name = name.trim();
  //   if (!name) { return; }
  //   this.collectionsService.addHero({ name } as Collection)
  //     .subscribe((collection: Collection) => {
  //       this.collections.push(collection);
  //     });
  // }

  ngOnInit(): void
  {
    //this.getCollections();
  }

  newCollection(value: string) {
    //this.collectionsService.createNewCollection(value);
    console.log("newcollection");

    this.collectionsService.createNewCollection(value)                      //this is an asynchronous operation
      .subscribe();
  }
}
