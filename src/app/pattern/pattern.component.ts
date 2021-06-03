import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pattern',
  templateUrl: './pattern.component.html',
  styleUrls: ['./pattern.component.css']
})
export class PatternComponent implements OnInit {

  title = 'testAngular';
  username: string | undefined;
  spacing: number = 18;
  rotate : string | undefined;
  rotateNum: number = 0;

  ngOnInit(){
    document.addEventListener("change", ()=>{
      console.log("yes");
      this.username = (<HTMLInputElement>document.getElementById("name")).value;
      this.spacing = +this.username;

      this.rotate = (<HTMLInputElement>document.getElementById("rotate")).value;
      this.rotateNum = +this.rotate;

      console.log(this.spacing);
      this.setSize(this.spacing, this.rotateNum);

    })
    this.setSize(this.spacing, this.rotateNum);
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


  setSize(spacing: number, rotateNum: number) {
    console.log("yes");
    let c = <HTMLCanvasElement> document.getElementById("myCanvas");
    c.width = (window.innerWidth);

    const ctx =<CanvasRenderingContext2D> c.getContext("2d");

    var motif = new Image();
    motif.style.width = "1";
    console.log(motif.width);
    ctx.rotate(rotateNum);

    motif.onload = function () {
      let k = 1;

      k=1;
      let l = 1;
      ctx.scale(0.7, 0.7);
      for(let i = 0 ; i < 100; i++){
        k=1;

        for(let j = 0 ; j < 100 ; j++){
          if(l*5<window.innerWidth || k*8<window.innerHeight)
            ctx.drawImage(motif, l*5, /*-340*/8*k, /*150*/180, /*c.height*2*/150);

          k+=spacing;
        } l+=20;
      }

    };
    motif.src = "../assets/thread.svg";

  }

// Download
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


