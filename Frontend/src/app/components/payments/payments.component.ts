import { Component, OnInit } from '@angular/core';

import { CollectionsServiceService } from '../../services/collections-service.service';
import { LoginService } from '../../services/login.service';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
})
export class PaymentsComponent implements OnInit {
stripe:any
  paymentHandler:any = null;
  private serverAPIURL = 'http://localhost:5000/pay';
  constructor(private loginService: LoginService, private collectionsService: CollectionsServiceService,private http: HttpClient) {

  }
  ngOnInit() {
    this.invokeStripe();

  }
///{ data: amount},{withCredentials: true}
  async callService(amount) {
    console.log("making call")
    await this.http.post(this.serverAPIURL,{})
      .subscribe( (resp: any) => {
      console.log("dfdsfjdshfs")
      console.log(resp)
    },(errorResp => {
     console.log(errorResp)
      console.log("failed");
    }))
  }

  makePayment(amount) {
    const paymentHandler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_51JWIZsHgVOPspuvRuKmrbhqQPeDeAwXgEhDYztocJWUJEYGI5b5Ciy2w5S7sXTgJ5qb1bLV0nOiTzYee6tscNPyS00hb8s0dAg',
      locale: 'auto',
      ////email:'bernakebirungi@gmail.com',  ---ADD USER EMAIL FROM THE SESSION
      token: (stripeToken: any) => {
        this.stripe=stripeToken
        console.log(this.stripe)

         this.http.post(this.serverAPIURL,{data:stripeToken})
          .subscribe( (resp: any) => {
            console.log("dfdsfjdshfs")
            console.log(resp)
          },(errorResp => {
            console.log(errorResp)
            console.log("failed");
          }))
       /// this.callService();
       /* this.collectionsService.getCollections().subscribe(collections => {
          console.log(collections)
        })*/

        //////////make API call to send details**********
        ///this.callService(stripeToken);


        console.log("makePayment")
        ///alert('Stripe token generated!');
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


