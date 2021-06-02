import { Component, OnInit } from '@angular/core';
import { Collection } from '../collection'
import { COLLECTIONS } from '../mock-collections'
import { CollectionsService } from '../collections.service'


@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.css']
})
export class CollectionsComponent implements OnInit {

  collections: Collection[] = []; //the collections that get displayed

  constructor(private collectionsService: CollectionsService) { }

  getCollections(): void //this funct gets called each time this component gets initialized
  {
    this.collectionsService.getCollections()                      //this is an asyncronous operation because it gets data from a server, a server does not return instantly
      .subscribe(collections => this.collections = collections);  //assigns data from server to local collections variable, gets an Observable
  }

  //add new collection
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
