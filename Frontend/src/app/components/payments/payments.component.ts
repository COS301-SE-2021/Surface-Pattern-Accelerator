import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
})
export class PaymentsComponent implements OnInit {

  paymentHandler:any = null;

  constructor() { }

  ngOnInit() {
    this.invokeStripe();
  //   //stripe payment
  //   const stripe = require('stripe')('sk_test_51JWIR0GnSZPbZIbcuxh2UOQBVHpVRQeFf4KagJ18wjYP9Rz0L2qs72idNwWjLNBi02563n0E2YqQysHxa7xzuUoa00yE0zX9Ml');
  //   const express = require('express');
  //   const app = express();
  //   app.use(express.static('public'));
  //
  //   const YOUR_DOMAIN = 'http://localhost:8100';
  //
  //   app.post('/create-checkout-session', async (req, res) => {
  //     const session = await stripe.checkout.sessions.create({
  //       line_items: [
  //         {
  //           // TODO: replace this with the `price` of the product you want to sell
  //           price: 'price_1JWJO7GnSZPbZIbccDcaukYW',
  //           quantity: 1,
  //         },
  //       ],
  //       payment_method_types: [
  //         'card',
  //         'alipay'
  //       ],
  //       mode: 'payment',
  //       success_url: `${YOUR_DOMAIN}/success.html`,
  //       cancel_url: `${YOUR_DOMAIN}/cancel.html`,
  //     });
  //
  //     res.redirect(303, session.url)
  //   });
  }

  makePayment(amount) {
    const paymentHandler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_51JWIZsHgVOPspuvRuKmrbhqQPeDeAwXgEhDYztocJWUJEYGI5b5Ciy2w5S7sXTgJ5qb1bLV0nOiTzYee6tscNPyS00hb8s0dAg',
      locale: 'auto',
      token: function (stripeToken: any) {
        console.log(stripeToken)
        alert('Stripe token generated!');
      }
    });

    paymentHandler.open({
      name: 'Surface Pattern Accelerator',
      description: '3 widgets',
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
            alert('Payment has been successfull!');
          }
        });
      }

      window.document.body.appendChild(script);
    }
  }



}
