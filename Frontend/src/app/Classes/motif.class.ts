import {fabric} from "fabric";
export class motif
{
  obj :  fabric.Object | fabric.Group;
  id: string;


  constructor(motifURL: string, motifID: string)
  {
    this.id = motifID;
    // if (!motifURL.includes("https://cors-anywhere.herokuapp.com/"))
    // {
    //   motifURL = "https://cors-anywhere.herokuapp.com/" + motifURL;
    // }

    fabric.loadSVGFromURL(motifURL, (objects, options) => {
      this.obj = fabric.util.groupSVGElements(objects, options); //TODO: see what is contained in objects and option
      console.log("Cached: " + motifID)
    })
  }



}
