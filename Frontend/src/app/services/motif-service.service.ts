import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {motifsInterface} from "../Interfaces/motifsInterface";
import {GLoginService} from "./g-login.service";
import {motif} from "../Classes/motif.class";
import {motifBodyInterface} from "../Interfaces/motifBodyInterface";

@Injectable({
  providedIn: 'root'
})
export class MotifServiceService {

  private serverURL = 'http://localhost:3000';
  motifs?: motifsInterface;
  motifObjects: motif[] = [];

  constructor(private http: HttpClient, private gLoginService: GLoginService) { }

  getMotifs()//: Observable< motifsInterface>
  {
    console.log("get motifs fired!");
    const getCollectionsURL = this.serverURL + '/api/getMotifs';
    this.http.get<motifsInterface>(getCollectionsURL, {withCredentials: true})
      .subscribe(motifs =>
      {
        this.motifs = motifs
        for (let mot in this.motifs.motifDetails)
        {
          if(motifs.motifDetails.hasOwnProperty(mot))
          {
            //let svgPathPromise = this.getSVGPaths(this.motifs.motifDetails[mot]);
            this.motifObjects.push(new motif(this.motifs.motifDetails[mot].motifLink,this.motifs.motifDetails[mot].motifID, this.motifs.motifDetails[mot].motifName));
            this.motifObjects[mot].cacheSVGInMemory();
          }
        }

        //console.log(motifs)
      });//GET request
  }




}
