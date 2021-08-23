import { Injectable } from '@angular/core';
import {Observable, ReplaySubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GLoginService {

  private auth2: gapi.auth2.GoogleAuth;
  private subject = new ReplaySubject<gapi.auth2.GoogleUser>(1);

  constructor() {
    gapi.load('auth2', () => {
      console.log("Gapi created");
      this.auth2 = gapi.auth2.init({ //TODO: replace with environment variables
        client_id: '838530253471-o3arioj6ta566o6eg8140npcvb7a59tv.apps.googleusercontent.com'
      })
    })
  }

  async signIn()
  {
    console.log("Test 2")
    this.auth2.signIn({
      scope: 'https://www.googleapis.com/auth/drive'
    })
      .then( user => {
        this.subject.next(user);
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
