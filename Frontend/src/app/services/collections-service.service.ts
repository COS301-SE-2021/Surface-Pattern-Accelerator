import { Injectable } from '@angular/core';
import { ICollectionsInterface } from '../Interfaces/collections.interface';
import { Observable, of } from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CollectionsServiceService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

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


  getCollections(): Observable< ICollectionsInterface>
  {
    console.log("get collections fired!");
    const getCollectionsURL = this.serverURL + '/api/getCollections';
    return this.http.get<ICollectionsInterface>(getCollectionsURL, {withCredentials: true}); //GET request
  }

  /** POST: add a new collection to the server */
   createNewCollection(collectionName: string) {
    const newCollectionURL = this.serverURL + '/api/newCollection';
    console.log(newCollectionURL)
    return this.http.post<any>(newCollectionURL,
      {collectionName: collectionName},
      {withCredentials: true});
   }







}

