import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
})
export class PaymentsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
//     const crypto = require("crypto");
//
//     const myData = [];
// // Merchant details
//     myData["merchant_id"] = "10000100";
//     myData["merchant_key"] = "46f0cd694581a";
//     myData["return_url"] = "http://www.yourdomain.co.za/return_url";
//     myData["cancel_url"] = "http://www.yourdomain.co.za/cancel_url";
//     myData["notify_url"] = "http://www.yourdomain.co.za/notify_url";
// // Buyer details
//     myData["name_first"] = "First Name";
//     myData["name_last"] = "Last Name";
//     myData["email_address"] = "test@test.com";
// // Transaction details
//     myData["m_payment_id"] = "1234";
//     myData["amount"] = "10.00";
//     myData["item_name"] = "Order#123";
//
//     const generateSignature = (data, passPhrase = null) => {
//       // Create parameter string
//       let pfOutput = "";
//       for (let key in data) {
//         if(data.hasOwnProperty(key)){
//           if (data[key] !== "") {
//             pfOutput +=`${key}=${encodeURIComponent(data[key].trim()).replace(/%20/g, "+")}&`
//           }
//         }
//       }
//
//       // Remove last ampersand
//       let getString = pfOutput.slice(0, -1);
//       if (passPhrase !== null) {
//         getString +=`&passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, "+")}`;
//       }
//
//       return crypto.createHash("md5").update(getString).digest("hex");
//     };


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

//   // Generate signature
//   myData["signature"] = generateSignature(this.myData);
//
//   let htmlForm = `<form action="https://${pfHost}/eng/process" method="post">`;
//   for (let key in myData) {
//   if(myData.hasOwnProperty(key)){
//   value = myData[key];
//   if (value !== "") {
//   htmlForm +=`<input name="${key}" type="hidden" value="${value.trim()}" />`;
//   }
//     }
// }
//
// htmlForm += '<input type="submit" value="Pay Now" /></form>';


}
