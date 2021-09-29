import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServerLinkService {

  constructor() { }

  getServerLink()
  {
    //return "http://ec2-13-244-75-255.af-south-1.compute.amazonaws.com:3000"
    return "http://localhost:3000"

  }
}
