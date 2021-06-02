import { Injectable } from '@angular/core';
import { Collection } from './collection';
import { COLLECTIONS } from './mock-collections';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root' //root level creates a single sharable instance
})
export class CollectionsService {

  private collectionsUrl = 'api/collections';

  constructor(private http: HttpClient) { }

  //non http getCollections:
  getCollections(): Observable< Collection[]>
  {
    const collections = of(COLLECTIONS);
    return collections; // returns observable
  }


}
