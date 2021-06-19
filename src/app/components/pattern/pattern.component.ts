import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { ExportPopoverComponent } from '../export-popover/export-popover.component';
import { PreviewComponent } from '../preview/preview.component';

@Component({
  selector: 'app-pattern',
  templateUrl: './pattern.component.html',
  styleUrls: ['./pattern.component.scss'],
})
export class PatternComponent implements OnInit {

  title = 'testAngular';
  username: string | undefined;
  spacing: number = 18;
  rotate : string | undefined;
  rotateNum: number = 0;
  scale : string | undefined;
  scaleNum: number = 0.7;

  ngOnInit(){
    document.addEventListener("change", ()=>{
      console.log("yes");
      this.username = (<HTMLInputElement>document.getElementById("name")).value;
      this.spacing = +this.username;

      this.rotate = (<HTMLInputElement>document.getElementById("rotate")).value;
      this.rotateNum = +this.rotate;

      this.scale = (<HTMLInputElement>document.getElementById("scale")).value;
      this.scaleNum = +this.scale;

      this.setSize(this.spacing, this.rotateNum, this.scaleNum);

    })
    this.setSize(this.spacing, this.rotateNum, this.scaleNum);
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


  setSize(spacing: number, rotateNum: number, scaleNum: number) {
    let c = <HTMLCanvasElement> document.getElementById("myCanvas");
    //c.width = (window.innerWidth);

    const ctx =<CanvasRenderingContext2D> c.getContext("2d");

    let motif = new Image();
    motif.style.width = "1";
    ctx.rotate(rotateNum);

    motif.onload = function () {
      let k = 1;

      k=1;
      let l = 1;
      ctx.scale(1,1);
      ctx.scale(scaleNum, scaleNum);
      for(let i = 0 ; i < 100; i++){
        k=1;

        for(let j = 0 ; j < 100 ; j++){
          //if(l*5<window.innerWidth || k*8<window.innerHeight)
          ctx.drawImage(motif, l*5, /*-340*/8*k, /*150*/180, /*c.height*2*/150);
          // else break;

          k+=spacing;
        } l+=20;
      }

    };
    motif.src = "../assets/shapes.svg";

    //This is for unit testing
    return motif.src;
  }

// Download
  downloadCanvas(canvas : HTMLCanvasElement){
    //better UI experience for downloading, by generating a popover dialogue
    this.createPopover();

    // get canvas data
    let image = canvas.toDataURL();

    // create temporary link
    let tmpLink = document.createElement( 'a' );
    tmpLink.download = 'image.png'; // set the name of the download file
    tmpLink.href = image;

    // temporarily add link to body and initiate the download
    document.body.appendChild( tmpLink );
    tmpLink.click();
    document.body.removeChild( tmpLink );

    //This is for unit testing
    return true;
  }

  /*
    ModalController object is intialised as this component is constructed.
    The ModalController object is used in openModal() to open the ionic component modal.

    The PopoverController object is intialised as this component is constructed.
    The PopoverController object is used in createPopover() to open the ionic popover component.
   */
  constructor(private modalCtrl: ModalController,
              private popover: PopoverController) {}

  /*
      When the preview button is clicked,
      this function is run to display the ionic modal
      component with the preview image, from the preview component.
   */
  async openModal() {
    // @ts-ignore
    const modal = await this.modalCtrl.create({
      component: PreviewComponent
    });

    await modal.present();

    //This is for unit testing
    return true;
  }

  createPopover() {
    this.popover.create({component: ExportPopoverComponent,
    showBackdrop: false}).then((popoverElement)=>{
      popoverElement.present();
    })
  }
}
