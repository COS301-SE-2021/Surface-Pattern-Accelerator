import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentGuardGuard implements CanActivate {
  hasPayed: boolean = false;
  constructor(public router: Router) {}
  canActivate(){

    // if(this.hasPayed == false)
    // {
    //   this.router.navigate(['payment'])
    //   alert("Please make a payment before you can access the functionality");
    // }
    // return this.hasPayed;
    return true;
  }

}
