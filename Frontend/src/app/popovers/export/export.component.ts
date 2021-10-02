import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss'],
})
export class ExportComponent implements OnInit {

  @Input() downloadURL: string;

  constructor() { }

  ngOnInit() {}

}
