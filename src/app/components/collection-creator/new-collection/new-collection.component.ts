import { Component, OnInit } from '@angular/core';
import { CollectionsServiceService } from '../../../services/collections-service.service';
import {ICollectionsContent} from "../../../Interfaces/collectionContents.interface"
import {Router} from "@angular/router";
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-new-collection',
  templateUrl: './new-collection.component.html',
  styleUrls: ['./new-collection.component.scss'],
})
export class NewCollectionComponent implements OnInit {

  constructor(private collectionsService: CollectionsServiceService, private router: Router, public loadingController: LoadingController) { }

  ngOnInit()
  {
      console.log('new collection component created');
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
              this.router.navigate(['pattern/' + tempCollectionDetailsStorage.collectionID + "/" + tempCollectionDetailsStorage.collectionName]).then();
            });


          });
      })
    })



  }

}
