import {Injectable} from '@angular/core';
import {Observable, ReplaySubject, Subject} from "rxjs";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {LoadingController} from "@ionic/angular";
import {ServerLinkService} from "./server-link.service";

@Injectable({
  providedIn: 'root'
})
export class GLoginService {
  singedIn: Subject<boolean> = new Subject<boolean>();
  payed: Subject<boolean> = new Subject<boolean>();

//  private serverAPIURL = 'http://localhost:3000/api';
  private auth2: gapi.auth2.GoogleAuth;
  private subject = new ReplaySubject<gapi.auth2.GoogleUser>(1);
  private userDetails: gapi.auth2.GoogleUser;

  public hasPaid: Boolean = false;

  constructor(private router: Router, private http: HttpClient, public loadingController: LoadingController, private serverLink: ServerLinkService) {
    if (JSON.parse(sessionStorage.getItem('token')) != null) {
      this.singedIn.next(true);
    }
    if(sessionStorage.getItem('paid')){
      if(sessionStorage.getItem('paid') == 'true'){
        this.hasPaid = true;
      }
      else{
        sessionStorage.setItem('paid', 'false');
      }
    }


    gapi.load('auth2', () => {
      console.log("Gapi created");
      this.auth2 = gapi.auth2.init({
        client_id: '838530253471-o3arioj6ta566o6eg8140npcvb7a59tv.apps.googleusercontent.com' //TODO: replace with environment variables
      })
    })
  }

  getUserDetails() {
   if (sessionStorage.getItem('user')) {
     let tempUser: gapi.auth2.GoogleUser =  <gapi.auth2.GoogleUser> (JSON.parse(sessionStorage.getItem('user')).user);
     this.userDetails =  tempUser;

    }
    return this.userDetails;
  }

  async signIn() {
    console.log("Test 2")
    this.auth2.signIn({
      scope: 'https://www.googleapis.com/auth/drive'
    })
      .then(user => {
        if(sessionStorage.getItem('user')){
          user = JSON.parse(sessionStorage.getItem('user')).user;
        }
        else{
          let theUser = {'user': user, 'id': user.getId(), 'email': user.getBasicProfile().getEmail()};
          sessionStorage.setItem('user', JSON.stringify(theUser));
        }
        this.subject.next(user);

        // this.userEmail = user.getBasicProfile().getEmail();
        this.userDetails = user;
        if (JSON.parse(sessionStorage.getItem('token')) && JSON.parse(sessionStorage.getItem('token')).tokenid && JSON.parse(sessionStorage.getItem('token')).email === user.getBasicProfile().getEmail()) {
          this.singedIn.next(true);
          alert('Already Signed In');
          //TODO: CHECK IF PAID
          if (this.hasPaid) {
            console.log("YES PAID");
            //this.router.navigate(['collections']);
          } else {
            //  this.router.navigate(['payment'])
            console.log("NO NOT PAID");
          }
          //  this.router.navigate(['collections']) .then(() => {
          // //   loaderResult.dismiss(); //dismiss loading animation when successfully navigated to collections
          //  });
          //  //      }
          //  // else{
          //  //   this.router.navigate(['payment']);
          //  // }
          //  console.log("SIGNED IN ALREADY");
          //  return
        }
        console.log("SKIPPED");
        console.log(user.getId())
        this.loadingController.create({
          message: "Connecting to server..."
        }).then(loaderResult => {
          loaderResult.present().then(r => {


            this.createAccessTokenOnServer(user) //create access token on server and store in session. Used to fetch data from g drive
              .subscribe(response => {
                this.singedIn.next(true);
                let userid;
                if(sessionStorage.getItem('user'))
                {
                  userid = JSON.parse(sessionStorage.getItem('user')).id;
                }
                else{
                  userid = user.getId();
                }
                this.http.post(this.serverLink.getServerLink() + '/api/getPaymentDetails',
                  {
                    userID: userid
                  },
                  {
                    withCredentials: true
                  }).subscribe((result: any) => {

                  console.log(result.status)

                  this.hasPaid = result.status;

                  if (result.status) {
                    sessionStorage.setItem('paid', 'true');
                    console.log("is success")
                    this.router.navigate(['collections']) //navigate to collections when access token is set
                      .then(() => {
                        loaderResult.dismiss(); //dismiss loading animation when successfully navigated to collections
                      });
                  }

                  else {
                    sessionStorage.setItem('paid', 'false');
                    console.log("is failure");
                    // let userDetails = {'userDetails': this.userDetails};
                    // sessionStorage.setItem('userDetails', JSON.stringify(userDetails));
                    this.router.navigate(['payment']) //navigate to collections when access token is set
                      .then(() => {
                        loaderResult.dismiss(); //dismiss loading animation when successfully navigated to collections
                      });
                  }

                })
              });
          })
        })
      })
      .catch(() => {
        console.log("Cancelled");
        this.subject.next(null);
        //this.singedIn.next(false);
      })
  }

  signOut() {
    sessionStorage.clear();
    this.auth2.signOut()
      .then(() => {
        this.singedIn.next(false);
        this.subject.next(null);
        sessionStorage.clear();
        this.router.navigate(['/'])
          .then(() => {
            window.location.reload();
          });
      })
  }

  observable(): Observable<gapi.auth2.GoogleUser> {
    return this.subject.asObservable();
  }

  createAccessTokenOnServer(user: gapi.auth2.GoogleUser) {
    console.log("createAccessToken fired");
    console.log(user);
    console.log(user.getAuthResponse().access_token)
    let accessObject = {
      'tokenid': user.getAuthResponse().access_token,
      'email': user.getBasicProfile().getEmail(),
      'name': user.getBasicProfile().getName()
    }
   // let theUser = {'user': user, 'id': user.getId(), 'email': user.getBasicProfile().getEmail()};

    sessionStorage.setItem('token', JSON.stringify(accessObject));
   // sessionStorage.setItem('user', JSON.stringify(theUser));
    //sessionStorage.setItem('paid', 'false');

    this.singedIn.next(true);

    console.log("WE GET");
    console.log(user.getAuthResponse().expires_at);
    return this.http.post(this.serverLink.getServerLink() + '/api/createAccessToken',
      {
        access_token: user.getAuthResponse().access_token,
        expiry_date: user.getAuthResponse().expires_at
      },
      {
        withCredentials: true
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
    gapi.load('client', () => {
      gapi.client.load('drive', 'v2', () => {
        let file = gapi.client.drive.files.get({'fileId': fileID});
        file.execute(resp => {
          this.downloadFile(resp, res => {
            console.log(res);
          });
          console.log(resp)
        });
      });
    });
  }


}
