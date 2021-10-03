import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {GLoginService} from "./g-login.service";
import {HttpClient} from "@angular/common/http";
import {ServerLinkService} from "./server-link.service";

@Injectable({
  providedIn: 'root'
})
export class PaymentGuardGuard implements CanActivate {
  hasPayed: boolean = false;
  //private serverURL = 'http://localhost:3000';
  constructor(public router: Router, private gLoginService: GLoginService, private http: HttpClient,private serverLink: ServerLinkService) {}
  canActivate(){

    //if(this.gLoginService.getUserDetails() && this.gLoginService.getUserDetails().isSignedIn())
    if(sessionStorage.getItem('token'))
    {
      if (!sessionStorage.getItem('paid') || sessionStorage.getItem('paid') == 'false')
      {
        alert("Please make a payment to access these features");
        this.router.navigate(['payment']);
      }
      else
      {
        return true;
      }
    }
    else{
        alert("Please sign in with Google to access these features");
        this.router.navigate(['/']);
      }

    return false;
  }

}
