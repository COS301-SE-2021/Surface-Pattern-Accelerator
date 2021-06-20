import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-workarea',
  templateUrl: './workarea.component.html',
  styleUrls: ['./workarea.component.scss'],
})
export class WorkareaComponent implements OnInit {

  contentScrollActive = true;
  width = 500;
  height = 500;
  rwidth = 800;
  rect = 0;
  check = false;
  constructor() {
  }

  ngOnInit()
  {}
  // eslint-disable-next-line @typescript-eslint/member-ordering
  chooseCanvasSymbol(check){
    const myFrame = document.getElementById('canvasFrame');//get div of canvas frame
    if(check===true)//square is alright
    {
      check = true;
      this.width = 500;
      this.height = 500;
      myFrame.style.width = this.width + 40+ 'px';
      myFrame.style.height = this.height + 40 + 'px';
    }
    else{//rectangle is option
      check=false;
      this.width = 800;
      this.height = 500;
      myFrame.style.width = this.rwidth + 40 + 'px';
      myFrame.style.height = this.height + 40 +  'px';
    }
  }

}
