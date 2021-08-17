import { Component, OnInit } from '@angular/core';
import { PopoverController, } from '@ionic/angular';
import {MotifServiceService} from "../../services/motif-service.service"
import {motifsInterface} from "../../Interfaces/motifsInterface";

@Component({
  selector: 'app-motif-catalogue',
  templateUrl: './motif-catalogue.component.html',
  styleUrls: ['./motif-catalogue.component.scss'],
})
export class MotifCatalogueComponent implements OnInit {
  private motifs: motifsInterface;

  constructor(private popoverController: PopoverController, private motifService: MotifServiceService) { }

  ngOnInit() {
    this.getMotifs()
  }

  getMotifs(): void
  {
    this.motifService.getMotifs()
      .subscribe(motifs =>
      {
        this.motifs = motifs
        console.log(motifs)
      });
  }

  motifSelect(motifData: any){
    console.log(motifData)
  }

}
