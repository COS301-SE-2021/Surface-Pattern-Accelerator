import { Injectable } from '@angular/core';
import { Collection } from '../collection';
import { Observable, of } from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import {SourceCode} from "eslint";
// import Config = SourceCode.Config;

@Injectable({
  providedIn: 'root'
})
export class CollectionsServiceService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  //private collectionsUrl = 'api/collections'; //this is the endpoint for the collections array in the "in-memory-data.service"
  private collectionsUrl = 'http://localhost:3000/api/collections';

  constructor(private http: HttpClient) { }

  options: {
    headers?: HttpHeaders | {[header: string]: string | string[]},
    observe?: 'body', //| 'events' | 'response', //specifies how much of the response to return.
    params?: HttpParams|{[param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>},
    reportProgress?: boolean,
    responseType?: 'arraybuffer'|'blob'|'json'|'text', //specifies the format in which to return data.
    withCredentials?: boolean,
  }


  getCollections(): Observable< Collection>
  {
    return this.http.get<Collection>(this.collectionsUrl); //GET request

    // return this.http.get<Collection[]>(this.collectionsUrl)
    //   .pipe(catchError(this.handleError<Collection[]>('getHeroes', []))
    //   );
  }

  // GET collection by id.
  getCollection(id: number): Observable<Collection>
  {
    const url = `${this.collectionsUrl}/${id}`;
    return this.http.get<Collection>(url);
  }


  /** POST: add a new hero to the server */
  // addHero(collection: Collection): Observable<Collection> {
  //   return this.http.post<Collection>(this.collectionsUrl, collection, this.httpOptions).pipe(
  //     tap((newCollection: Collection) => this.log(`added collection w/ id=${newCollection.id}`)),
  //     catchError(this.handleError<Collection>('addCollection'))
  //   );
  // }


  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
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

interface Config {
  heroesUrl: string;
  textfile: string;
  date: any;
}
