import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ICollectionsContent} from '../Interfaces/collectionContents.interface';
import {ServerLinkService} from "./server-link.service";


@Injectable({
  providedIn: 'root'
})
export class CollectionsServiceService {

  public currentCollectionID: string;


  //private serverURL = 'http://ec2-3-128-186-246.us-east-2.compute.amazonaws.com:3000';

  constructor(private http: HttpClient, private serverLink: ServerLinkService) { }


  getCollections(): Observable<ICollectionsContent[]>
  {
    console.log('get collections fired!');
    const getCollectionsURL = this.serverLink.getServerLink() + '/api/getCollections';
    return this.http.get<ICollectionsContent[]>(getCollectionsURL, {withCredentials: true}); //GET request
  }

  /** POST: add a new collection to the server */
   createNewCollection(collectionName: string) {
    const newCollectionURL = this.serverLink.getServerLink() + '/api/newCollection';
    console.log(newCollectionURL);
    return this.http.post<any>(newCollectionURL,
      {collectionName},
      //{collectionName: collectionName},
      {withCredentials: true});
   }







}

