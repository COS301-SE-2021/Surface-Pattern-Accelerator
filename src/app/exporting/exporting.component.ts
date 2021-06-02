import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-exporting',
  templateUrl: './exporting.component.html',
  styleUrls: ['./exporting.component.css']
})
export class ExportingComponent implements OnInit {

  title = 'testAngular';
  username: string | undefined;
  iterations: number = 18;
  rotate : string | undefined;
  rotateNum: number = 0;

  ngOnInit(){
    document.addEventListener("change", ()=>{
      console.log("yes");
      this.username = (<HTMLInputElement>document.getElementById("name")).value;
      this.iterations = +this.username;

      this.rotate = (<HTMLInputElement>document.getElementById("rotate")).value;
      this.rotateNum = +this.rotate;

      console.log(this.iterations);
      this.setSize(this.iterations, this.rotateNum);

    })
    this.setSize(this.iterations, this.rotateNum);
    let downloadBtn = <HTMLElement> document.getElementById("download-btn");
    if(downloadBtn){
      downloadBtn.addEventListener("click", () => {
        let canvas = <HTMLCanvasElement> document.getElementById("myCanvas");

        // Init new filename
        let newFilename;
        newFilename =  "canvas-edited.jpg";


        // Call download
        canvas = <HTMLCanvasElement> document.getElementById("myCanvas");
        //this.download(canvas, newFilename);
        this.downloadCanvas(canvas);



      });
    }




  }



  setSize(iterations: number, rotateNum: number) {
    console.log("yes");
    let c = <HTMLCanvasElement> document.getElementById("myCanvas");
    c.width = (window.innerWidth);

    const ctx =<CanvasRenderingContext2D> c.getContext("2d");

    var campfire = new Image();
    campfire.style.width = "1";
    console.log(campfire.width);
    ctx.rotate(rotateNum);

    campfire.onload = function () {
      let k = 1;
      // for(let i = 0 ; i < 8; i++){
      // ///////work /////////////
      // ctx.drawImage(campfire, k*5, /*-340*/10, /*150*/180, /*c.height*2*/150);

      // k+=20;
      // }

      k=1;
      let l = 1;
      ctx.scale(0.7, 0.7);
      for(let i = 0 ; i < 100; i++){
        k=1;

        ///////work /////////////yes
        for(let j = 0 ; j < 100 ; j++){
          if(l*5<window.innerWidth || k*8<window.innerHeight)
            ctx.drawImage(campfire, l*5, /*-340*/8*k, /*150*/180, /*c.height*2*/150);

          k+=iterations;
        } l+=20;
      }

    };
    campfire.src = "../assets/thread.svg";


  }



// Download
  download(canvas : HTMLCanvasElement, filename : string) {


    // Init event
    let e;
    // Create link
    const link = document.createElement("a");

    // Set props
    link.download = filename;
    link.href = canvas.toDataURL("image/jpeg", 0.8);
    // New mouse event
    e = new MouseEvent("click");
    // Dispatch event
    link.dispatchEvent(e);
  }

  downloadCanvas(canvas : HTMLCanvasElement){
    // get canvas data
    var image = canvas.toDataURL();

    // create temporary link
    var tmpLink = document.createElement( 'a' );
    tmpLink.download = 'image.png'; // set the name of the download file
    tmpLink.href = image;

    // temporarily add link to body and initiate the download
    document.body.appendChild( tmpLink );
    tmpLink.click();
    document.body.removeChild( tmpLink );
  }


}


