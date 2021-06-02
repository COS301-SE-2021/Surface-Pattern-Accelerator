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

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

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

    return this.http.get<Collection[]>(this.collectionsUrl)
      .pipe(catchError(this.handleError<Collection[]>('getHeroes', []))
      )
  }

  // GET collection by id.
  getCollection(id: number): Observable<Collection> {
    const url = `${this.collectionsUrl}/${id}`;
    return this.http.get<Collection>(url);
  }


    /** POST: add a new hero to the server */
    addHero(collection: Collection): Observable<Collection> {
      return this.http.post<Collection>(this.collectionsUrl, collection, this.httpOptions).pipe(
        tap((newCollection: Collection) => this.log(`added collection w/ id=${newCollection.id}`)),
        catchError(this.handleError<Collection>('addCollection'))
      );
    }
 

  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(message); //display some error
  }



}
