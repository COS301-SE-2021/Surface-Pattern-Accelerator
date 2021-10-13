import { Component, OnInit } from '@angular/core';

import { CollectionsServiceService } from '../../services/collections-service.service';
import {HttpClient} from "@angular/common/http";
import {GLoginService} from "../../services/g-login.service";
import {Router} from "@angular/router";
import {ServerLinkService} from "../../services/server-link.service";

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  stripe:any
  paymentHandler:any = null;
  //private serverAPIURL = 'http://localhost:3000/api/';
  constructor(private gLoginService: GLoginService,
              private collectionsService: CollectionsServiceService,
              private http: HttpClient,
              public router: Router,
              private serverLink: ServerLinkService) {

  }
  ngOnInit() {
    this.invokeStripe();

  }

  makePayment(amount) {
    const paymentHandler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_51JWIZsHgVOPspuvRuKmrbhqQPeDeAwXgEhDYztocJWUJEYGI5b5Ciy2w5S7sXTgJ5qb1bLV0nOiTzYee6tscNPyS00hb8s0dAg',
      locale: 'auto',
      ////email:'bernakebirungi@gmail.com',  ---ADD USER EMAIL FROM THE SESSION
      token: (stripeToken: any) => {
        this.stripe=stripeToken
        console.log(this.stripe)

        this.http.post(this.serverLink.getServerLink() + '/api/makePayment',{
          userID:       JSON.parse(sessionStorage.getItem('user')).id,
          card_id:      0,
          stripeID:     stripeToken.created,
          userEmail:     JSON.parse(sessionStorage.getItem('user')).email,
          dateLastPayed:"0000-00-00",
          freeTrial:    0
        })
          .subscribe( (resp: any) => {
            console.log("payment success")
            this.gLoginService.hasPaid = true;

            console.log("RESULT IS");
            console.log(resp)
            if(resp.status == 'failed')
            {
              sessionStorage.setItem('paid', 'false');
            }
            else{
              sessionStorage.setItem('paid', 'true');
            }
            this.router.navigate(['collections']);
          },(errorResp => {
            console.log(errorResp)
           // console.log("failed");
          }))

      }
    });

    paymentHandler.open({
      name: 'Surface Pattern Accelerator',
      description: 'Yearly subscription',
      amount: amount * 100
    });
  }

  invokeStripe() {
    if(!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement("script");
      script.id = "stripe-script";
      script.type = "text/javascript";
      script.src = "https://checkout.stripe.com/checkout.js";
      script.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key: 'pk_test_51JWIZsHgVOPspuvRuKmrbhqQPeDeAwXgEhDYztocJWUJEYGI5b5Ciy2w5S7sXTgJ5qb1bLV0nOiTzYee6tscNPyS00hb8s0dAg',
          locale: 'auto',
          token: function (stripeToken: any) {
            console.log(stripeToken)
            console.log("invokeStripe")
            ///////send to the database
            /// this.callService();
            alert('Payment has been successfull!');
          }
        });
      }

      window.document.body.appendChild(script);
    }
  }

}
