import { Injectable } from '@angular/core';
import { Collection } from './collection';
import { COLLECTIONS } from './mock-collections';

@Injectable({
  providedIn: 'root' //root level creates a single sharable instance
})
export class CollectionsService {

  constructor() { }

  getCollections(): Collection[]
  {
    return COLLECTIONS;
  }
}
