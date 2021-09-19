import { Injectable } from '@angular/core';
import {Observable, ReplaySubject} from "rxjs";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {LoadingController} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class GLoginService {
  private serverAPIURL = 'http://localhost:3000/api';
  private auth2: gapi.auth2.GoogleAuth;
  private subject = new ReplaySubject<gapi.auth2.GoogleUser>(1);
  private userDetails: gapi.auth2.GoogleUser;

  public hasPaid: Boolean = false;

  constructor(private router: Router, private http: HttpClient, public loadingController: LoadingController) {
    gapi.load('auth2', () => {
      console.log("Gapi created");
      this.auth2 = gapi.auth2.init({
        client_id: '838530253471-o3arioj6ta566o6eg8140npcvb7a59tv.apps.googleusercontent.com' //TODO: replace with environment variables
      })
    })
  }
  getUserDetails(){
    return this.userDetails;
  }

  async signIn()
  {
    console.log("Test 2")
    this.auth2.signIn({
      scope: 'https://www.googleapis.com/auth/drive'
    })
      .then( user => {
        this.subject.next(user);
        // this.userEmail = user.getBasicProfile().getEmail();
        this.userDetails = user;
        console.log(user.getId())
        this.loadingController.create({
          message: "Connecting to server..."
        }).then(loaderResult => {
          loaderResult.present().then(r => {
            this.createAccessTokenOnServer(user) //create access token on server and store in session. Used to fetch data from g drive
              .subscribe(response => {

                this.http.post(this.serverAPIURL + '/getPaymentDetails',
                  {
                    userID: user.getId()
                  },
                  {
                    withCredentials: true
                  }).subscribe((result: any) => {
                    console.log(result.status)
                  if (result.status)
                  {
                    console.log("is success")
                    this.router.navigate(['collections']) //navigate to collections when access token is set
                      .then(() => {
                        loaderResult.dismiss(); //dismiss loading animation when successfully navigated to collections
                      });
                  }
                  else
                  {
                    console.log("is failure")
                    this.router.navigate(['payment']) //navigate to collections when access token is set
                      .then(() => {
                        loaderResult.dismiss(); //dismiss loading animation when successfully navigated to collections
                      });
                  }

                  //console.log(response);

                })


              });
          })
        })
      })
      .catch(() => {
        this.subject.next(null);
      })
  }

  signOut()
  {
    this.auth2.signOut()
      .then(() => {
        this.subject.next(null);
      })
  }

  observable() : Observable<gapi.auth2.GoogleUser>
  {
    return this.subject.asObservable();
  }

  createAccessTokenOnServer(user: any)
  {
    console.log("createAccessToken fired");
    console.log(user.Zb.access_token);
    return this.http.post(this.serverAPIURL + '/createAccessToken',
      { userLoginResponse: user },
      {withCredentials: true
      })
  }

  //gets file contents
  downloadFile(file, callback) {
    if (file.downloadUrl) {
      console.log(file.downloadUrl);
      console.log(file.downloadUrl.slice(15))
      const downloadURLModified = "https://www" + file.downloadUrl.slice(15)
      let accessToken = gapi.auth.getToken().access_token;
      console.log(accessToken)
      let xhr = new XMLHttpRequest();
      xhr.open('GET', downloadURLModified);
      xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
      xhr.onload = () => {
        callback(xhr.responseText);
      };
      xhr.onerror = () => {
        callback(null);
      };
      xhr.send();
    } else {
      callback(null);
    }
  }

  printFile(fileID: string) {
    gapi.load('client',  () => {
      gapi.client.load('drive', 'v2',  () => {
        let file = gapi.client.drive.files.get({ 'fileId': fileID });
        file.execute( resp => {
          this.downloadFile(resp, res => {
            console.log(res);
          });
          console.log(resp)

        });

      });
    });
  }






}
