import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
})
export class PaymentsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const crypto = require("crypto");

    const myData = [];
// Merchant details
    myData["merchant_id"] = "10000100";
    myData["merchant_key"] = "46f0cd694581a";
    myData["return_url"] = "http://www.yourdomain.co.za/return_url";
    myData["cancel_url"] = "http://www.yourdomain.co.za/cancel_url";
    myData["notify_url"] = "http://www.yourdomain.co.za/notify_url";
// Buyer details
    myData["name_first"] = "First Name";
    myData["name_last"] = "Last Name";
    myData["email_address"] = "test@test.com";
// Transaction details
    myData["m_payment_id"] = "1234";
    myData["amount"] = "10.00";
    myData["item_name"] = "Order#123";

    const generateSignature = (data, passPhrase = null) => {
      // Create parameter string
      let pfOutput = "";
      for (let key in data) {
        if(data.hasOwnProperty(key)){
          if (data[key] !== "") {
            pfOutput +=`${key}=${encodeURIComponent(data[key].trim()).replace(/%20/g, "+")}&`
          }
        }
      }

      // Remove last ampersand
      let getString = pfOutput.slice(0, -1);
      if (passPhrase !== null) {
        getString +=`&passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, "+")}`;
      }

      return crypto.createHash("md5").update(getString).digest("hex");
    };
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
