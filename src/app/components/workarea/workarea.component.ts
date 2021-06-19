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



  saveCanvasImage()
  {

  }
  // ionViewDidEnter() {
  //   dragMoveListener(event) {
  //     var target = event.target,
  //       // keep the dragged position in the data-x/data-y attributes
  //       x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
  //       y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
  //
  //     // translate the element
  //     target.style.webkitTransform =
  //       target.style.transform =
  //         'translate(' + x + 'px, ' + y + 'px)';
  //
  //     // update the posiion attributes
  //     target.setAttribute('data-x', x);
  //     target.setAttribute('data-y', y);
  //   }
  //
  //
  //   interact('.draggable')
  //     .draggable({
  //       // enable inertial throwing
  //       inertia: true,
  //       // keep the element within the area of it's parent
  //       restrict: {
  //         restriction: "parent",
  //         endOnly: true,
  //         elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
  //       },
  //       // enable autoScroll
  //       autoScroll: true,
  //
  //       // call this function on every dragmove event
  //       onmove: dragMoveListener,
  //       // call this function on every dragend event
  //       onend: function (event) {
  //         var textEl = event.target.querySelector('p');
  //         textEl && (textEl.textContent =
  //           'moved a distance of '
  //           + (Math.sqrt(Math.pow(event.pageX - event.x0, 2) +
  //           Math.pow(event.pageY - event.y0, 2) | 0))
  //             .toFixed(2) + 'px');
  //       }
  //     });
  //
  // }

}
