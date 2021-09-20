import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServerLinkService {

  constructor() { }

  getServerLink()
  {
    return "http://localhost:3000"
  }
}
