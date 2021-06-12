import { Component, OnInit } from '@angular/core';
import { CollectionsInterface } from '../../Interfaces/collectionsInterface';
import { CollectionsServiceService } from '../../services/collections-service.service';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss'],
})
export class CollectionsComponent implements OnInit {

  collections?: CollectionsInterface; //the collections that get displayed, marked as optional

  constructor(private collectionsService: CollectionsServiceService) { }

  getCollections(): void //this func gets called each time this component gets initialized
  {
    this.collectionsService.getCollections()                      //this is an asynchronous operation
      .subscribe(collections => this.collections = collections);  //Observable
  }

  //add new collection
  //TODO: create collection on server
  add(name: string): void {
    // name = name.trim();
    // if (!name) { return; }
    // this.collectionsService.addHero({ name } as Collection)
    //   .subscribe((collection: Collection) => {
    //     this.collections.push(collection);
    //   });
  }

  ngOnInit(): void
  {
    this.getCollections();
  }

}
