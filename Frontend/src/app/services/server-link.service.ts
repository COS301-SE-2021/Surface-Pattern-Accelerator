import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServerLinkService {

  constructor() { }

  getServerLink()
  {
    return "http://ec2-18-217-22-218.us-east-2.compute.amazonaws.com:3000"
    //return "http://localhost:3000"
  }
}
