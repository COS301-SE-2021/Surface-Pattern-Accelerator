import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServerLinkService {

  constructor() { }

  getServerLink()
  {
    return "http://ec2-3-128-186-246.us-east-2.compute.amazonaws.com:3000"
    //return "http://localhost:3000"
  }
}
