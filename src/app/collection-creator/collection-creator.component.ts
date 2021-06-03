import { Component, OnInit } from '@angular/core';
import { Collection } from '../collection'
import { CollectionsService } from '../collections.service'

@Component({
  selector: 'app-collection-creator',
  templateUrl: './collection-creator.component.html',
  styleUrls: ['./collection-creator.component.css']
})
export class CollectionCreatorComponent implements OnInit {

  //the collections that get displayed
  collections: Collection[] = []; 

  constructor(private collectionsService: CollectionsService) { }

  //this funct gets called each time this component gets initialized
  getCollections(): void 
  {
    this.collectionsService.getCollections()                      //this is an asyncronous operation because it gets data from a server, a server does not return instantly
      .subscribe(collections => this.collections = collections);  //assigns data from server to local collections variable, gets an Observable
  }

  //add a new collection
  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.collectionsService.addHero({ name } as Collection)
      .subscribe((collection: Collection) => {
        this.collections.push(collection);
      });
  }

  ngOnInit(): void
  {
    this.getCollections();
  }

}
