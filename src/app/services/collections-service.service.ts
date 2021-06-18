import { Injectable } from '@angular/core';
import { CollectionsInterface } from '../Interfaces/collectionsInterface';
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

  //private serverURL = 'api/collections'; //this is the endpoint for the collections array in the "in-memory-data.service"
  private serverURL = 'http://localhost:3000';
  //private serverURL = 'http://ec2-3-128-186-246.us-east-2.compute.amazonaws.com:3000';

  constructor(private http: HttpClient) { }

  options: {
    headers?: HttpHeaders | {[header: string]: string | string[]},
    observe?: 'body', //| 'events' | 'response', //specifies how much of the response to return.
    params?: HttpParams|{[param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>},
    reportProgress?: boolean,
    responseType?: 'arraybuffer'|'blob'|'json'|'text', //specifies the format in which to return data.
    withCredentials?: boolean,
  }


  getCollections(): Observable< CollectionsInterface>
  {
    const getCollectionsURL = this.serverURL + '/api/collections';
    return this.http.get<CollectionsInterface>(getCollectionsURL); //GET request

    // return this.http.get<Collection[]>(this.serverURL)
    //   .pipe(catchError(this.handleError<Collection[]>('getHeroes', []))
    //   );
  }

  /** POST: add a new collection to the server */
   createNewCollection(collectionName: string) {
     // return this.http.post<CollectionsInterface>(this.serverURL, collection, this.httpOptions).pipe(
     //   tap((newCollection: CollectionsInterface) => this.log(`added collection w/ id=${newCollection}`)),
     //   catchError(this.handleError<CollectionsInterface>('addCollection'))
     // );
    const newCollectionURL = this.serverURL + '/api/newCollection/' + collectionName;
    console.log(newCollectionURL)
    return this.http.get<any>(newCollectionURL);
   }


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

