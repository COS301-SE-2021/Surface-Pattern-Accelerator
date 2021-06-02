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

  collections: Collection[] = [];

  constructor(private collectionsService: CollectionsService) { }

  getCollections(): void
  {
    this.collections = this.collectionsService.getCollections();
  }

  ngOnInit(): void
  {
    this.getCollections();
  }

}
