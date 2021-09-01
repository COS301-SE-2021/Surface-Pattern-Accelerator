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
  motifs: motifsInterface;
  selectedMotifs: motifsInterface = {motifDetails: []};
  constructor(private popoverController: PopoverController, private motifService: MotifServiceService) { }

  ngOnInit() {
    this.getMotifs()
  }

  getMotifs(): void
  {
    this.motifService.getAllMotifs()
      .subscribe(motifs => {
        console.log(motifs)
        this.motifs = motifs;
      })
  }

  motifSelect(motifData: any){
    console.log("adding motif demo")

    for (let mot = 0; mot < this.selectedMotifs.motifDetails.length; mot++)
    {
      if (this.selectedMotifs.motifDetails[mot].motifID == motifData.motifID)
      {
        //delete this.selectedMotifs.motifDetails[mot];
        this.selectedMotifs.motifDetails.splice(Number(mot),1);
        console.log(this.selectedMotifs)
        return
      }
    }
    //else if not in array, add to array
    this.selectedMotifs.motifDetails.push(motifData)
    console.log(this.selectedMotifs)
  }

  selectedState(motifID: string)
  {
    if (this.selectedMotifs.motifDetails != undefined && this.selectedMotifs.motifDetails.length > 0)
    {
      console.log(this.selectedMotifs)
      for (let i = 0; i < this.selectedMotifs.motifDetails.length; i++)
      {
        if (motifID == this.selectedMotifs.motifDetails[i].motifID)
        {
          return "buttonSelected"
        }
      }
    }
    return "buttonUnselected"
  }

}
