import { Component, OnInit } from '@angular/core';
import { CollectionsServiceService } from '../../../services/collections-service.service';
import {ICollectionsContent} from "../../../Interfaces/collectionContents.interface"
import {Router} from "@angular/router";
import { LoadingController } from '@ionic/angular';
import {MotifServiceService} from "../../../services/motif-service.service";
import {PatternService} from "../../../services/pattern.service";

@Component({
  selector: 'app-new-collection',
  templateUrl: './new-collection.component.html',
  styleUrls: ['./new-collection.component.scss'],
})
export class NewCollectionComponent implements OnInit {

  colorCodeHex: string;
  constructor(private collectionsService: CollectionsServiceService,
              public motifService: MotifServiceService,
              public patternService: PatternService,
              private router: Router,
              public loadingController: LoadingController) { }

  ngOnInit()
  {
      console.log('new collection component created');
      this.motifService.purgeContent();
      this.patternService.purgeContent();
  }

  newCollection(value: string) {
    //this.collectionsService.createNewCollection(value);
    //console.log(value);

    this.loadingController.create({
      message: "Creating Collection..."
    }).then(loaderResult => {
      loaderResult.present().then(r => {
        this.collectionsService.createNewCollection(value)                      //this is an asynchronous operation
          .subscribe(newCollectionResult => {
            let tempCollectionDetailsStorage: ICollectionsContent = newCollectionResult as ICollectionsContent;
            console.log("Temp Collection storage is:");
            console.log(tempCollectionDetailsStorage);
            loaderResult.dismiss().then(dismissResult => {
              this.collectionsService.currentCollectionID = tempCollectionDetailsStorage.collectionID;
              this.router.navigate(['pattern']).then();
            });


          });
      })
    })



  }

  getColorCodes() {
    const colorValue = document.getElementById('color') as HTMLInputElement;
    this.colorCodeHex = 'Color code: ' + colorValue.value;
    console.log(this.colorCodeHex);
  }
}
