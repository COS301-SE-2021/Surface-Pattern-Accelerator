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

    // if(this.gLoginService.getUserDetails() && this.gLoginService.getUserDetails().isSignedIn())
    // {
    //
    //     this.http.post(this.serverURL + '/api/payment' ,
    //       { email: this.gLoginService.getUserDetails().getBasicProfile().getEmail()},
    //       {withCredentials: true})
    //       .subscribe((data:any)=>{
    //         if(data.status == 'success ok'){
    //           console.log(data);
    //           this.hasPayed = true;
    //           //return true;
    //         }
    //         else{
    //           this.router.navigate(['payment']);
    //           this.hasPayed = false;
    //           //return false;
    //         }
    //       })
    // }
    // else{
    //     alert("Please sign in with Google to access these features");
    //     this.router.navigate(['/']);
    //   this.hasPayed = false;
    //   }
    //
    // return this.hasPayed;
    return true;
  }

}
