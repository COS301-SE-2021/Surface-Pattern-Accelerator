import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Collection } from './collection';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {

  constructor() { }

  createDb()
  {
    const collections = [
      { id: 11, name: 'Collection 1' },
      { id: 13, name: 'Collection 2' },
      { id: 14, name: 'Collection 3' },
      { id: 15, name: 'Collection 4' },
      { id: 16, name: 'Collection 5' },
    ];
    return {collections};
  }
}



