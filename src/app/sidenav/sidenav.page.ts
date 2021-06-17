import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.page.html',
  styleUrls: ['./sidenav.page.scss'],
})
export class SidenavPage implements OnInit {
  //Variable declarations
  dropdown;
  i : number;

  ngOnInit() {
    document.addEventListener("change", ()=>{
      console.log("Sidenav started.");
      this.dropdown = (<HTMLElement><unknown>document.getElementsByClassName("dropdown-btn"));

      for (this.i = 0; this.i < this.dropdown.length; this.i++) {
        this.dropdown[this.i].addEventListener('click', function () {
          this.classList.toggle("active");
          let dropdownContent = this.nextElementSibling;
          if (dropdownContent.style.display === "block") {
            dropdownContent.style.display = "none";
          } else {
            dropdownContent.style.display = "block";
          }
        });
      }
    })

  }

}
