import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {motifsInterface} from "../Interfaces/motifsInterface";

@Injectable({
  providedIn: 'root'
})
export class MotifServiceService {

  private serverURL = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getMotifs(): Observable< motifsInterface>
  {
    console.log("get motifs fired!");
    const getCollectionsURL = this.serverURL + '/api/getMotifs';
    return this.http.get<motifsInterface>(getCollectionsURL, {withCredentials: true}); //GET request
  }
}
