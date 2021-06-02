import { Injectable } from '@angular/core';
import { Collection } from './collection';
import { COLLECTIONS } from './mock-collections';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root' //root level creates a single sharable instance
})
export class CollectionsService {

  private collectionsUrl = 'api/collections'; //this is the endpoint for the collections array in the "in-memory-data.service"

  constructor(private http: HttpClient) { }

  //non http getCollections:
  // getCollections(): Observable< Collection[]>
  // {
  //   const collections = of(COLLECTIONS);
  //   return collections; // returns observable
  // }

  getCollections(): Observable< Collection[]>
  {
    //TODO: add pipe for error handeling
    return this.http.get<Collection[]>(this.collectionsUrl);
  }

  // GET collection by id.
  getCollection(id: number): Observable<Collection> {
    const url = `${this.collectionsUrl}/${id}`;
    return this.http.get<Collection>(url);
  }

  /** POST: add a new hero to the server */
  // addHero(collection: Collection): Observable<Collection> {
  //   return this.http.post<Collection>(this.collectionsUrl, collection, this.httpOptions).pipe(
  //     tap((newCollection: Collection) => this.log(`added hero w/ id=${newHero.id}`)),
  //     catchError(this.handleError<Collection>('addCollection'))
  //   );
  // }




}
