
import {motifBodyInterface} from "../Interfaces/motifBodyInterface";
import {fabric} from "fabric"
export class motif
{
  obj :  fabric.Object | fabric.Group;
  motifURL: string;
  id: string;
  motifName: string;


  constructor(motifURL: string, motifID: string, motifName: string)
  {
    this.id = motifID;
    this.motifURL = motifURL;
    this.motifName = motifName;
    console.log("Constructed: " + this.motifName + " with ID: " + this.id)
  }

  //gets file contents
  getFileContents(file, callback) {
    if (file.downloadUrl) {
      //console.log(file.downloadUrl);
      //console.log(file.downloadUrl.slice(15))
      const downloadURLModified = "https://www" + file.downloadUrl.slice(15)
      let accessToken = gapi.auth.getToken().access_token;
      //console.log(accessToken)
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

  getSpecialDownloadURL(fileID: string) {
    return new Promise((resolve, reject) =>{
      gapi.load('client',  () => {
        gapi.client.load('drive', 'v2',  () => {
          let file = gapi.client.drive.files.get({ 'fileId': fileID });
          file.execute( resp => {
            this.getFileContents(resp, (SVGPathsRes: string) => {
              //console.log(SVGPathsRes);
              resolve(SVGPathsRes)
              //return SVGPathsRes;
            });
          });
        });
      });
    })
  }

  cacheSVGInMemory()
  {
    return new Promise((accept, reject) =>
    {
      this.getSpecialDownloadURL(this.id).then((content: string) => {
        fabric.loadSVGFromString(content, (objects, options) => {
          this.obj = fabric.util.groupSVGElements(objects, options); //TODO: see what is contained in objects and option
          this.obj.googleDriveID = "test ID here";
          //console.log(this.obj.googleDriveID)
          console.log("Cached: " + content)
          accept(this.id);
        })
      })
    })


  }





}
