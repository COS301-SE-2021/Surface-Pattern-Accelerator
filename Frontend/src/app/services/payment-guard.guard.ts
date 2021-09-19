import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {GLoginService} from "./g-login.service";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PaymentGuardGuard implements CanActivate {
  hasPayed: boolean = false;
  private serverURL = 'http://localhost:3000';
  constructor(public router: Router, private gLoginService: GLoginService, private http: HttpClient) {}
  canActivate(){
    if(this.gLoginService.getUserDetails() && this.gLoginService.getUserDetails().isSignedIn())
    {

    this.http.post(this.serverURL + '/api/payment' ,
      { email: this.gLoginService.getUserDetails().getBasicProfile().getEmail()},
      {withCredentials: true})
      .subscribe(data=>{
        console.log(data);
      })


    }





    // if(this.hasPayed == false)
    // {
    //   this.router.navigate(['payment'])
    //   alert("Please make a payment before you can access the functionality");
    // }
    // return this.hasPayed;
    return true;
  }

}
