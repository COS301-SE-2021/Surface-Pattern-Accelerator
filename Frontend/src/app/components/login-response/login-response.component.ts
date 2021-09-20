import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import { LoadingController } from '@ionic/angular';
import {ServerLinkService} from "../../services/server-link.service";

@Component({
  selector: 'app-login-response',
  templateUrl: './login-response.component.html',
  styleUrls: ['./login-response.component.scss'],
})
export class LoginResponseComponent implements OnInit {

  accessCode: string;


  //private serverAPIURL = 'http://ec2-3-128-186-246.us-east-2.compute.amazonaws.com:3000/api';

  constructor(private route: ActivatedRoute,
              private router: Router,
              private http: HttpClient,
              public loadingController: LoadingController,
              private serverLink: ServerLinkService) {
    this.route.queryParams.subscribe(params => {
      this.accessCode = params['code'];
    });
  }

  ngOnInit()
  {
    console.log(this.accessCode);
    this.loadingController.create({
      message: "Connecting to server..."
    }).then(loaderResult => {
      loaderResult.present().then(r => {
        this.setAuthCodeOnServer(this.accessCode) //sends auth code that was gotten from google and sets it in the session on the server
          .subscribe((resp: any) => {
            console.log(resp);
            loaderResult.dismiss().then(dismissResult => {
              this.router.navigate(['collections']).then();
            });

          })
      })

    })


  }

  setAuthCodeOnServer(accessCode: string)
  {
    console.log("set auth code on server fired");

    return this.http.post(this.serverLink.getServerLink() + '/api/consumeAccessCode',
      { accessCode: accessCode, },
      {withCredentials: true
      });
  }


}
