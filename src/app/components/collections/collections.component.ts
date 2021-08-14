import { Component, OnInit } from '@angular/core';
import { ICollectionsInterface } from '../../Interfaces/collections.interface';
import { CollectionsServiceService } from '../../services/collections-service.service';
import {Router} from "@angular/router";
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss'],
})
export class CollectionsComponent implements OnInit {

  collections?: ICollectionsInterface; //the collections that get displayed, marked as optional

  constructor(private collectionsService: CollectionsServiceService, private router: Router, public loadingController: LoadingController) { }

  ngOnInit(): void
  {
    this.getCollections();
  }

  getCollections(): void //this func gets called each time this component gets initialized
  {
    this.loadingController.create({
      message: "Fetching collections..."
    }).then(loaderResult => {
      loaderResult.present().then(r => {
        this.collectionsService.getCollections()                      //this is an asynchronous operation
          .subscribe(collections =>
          {
            console.log(collections)
            this.collections = collections
            loaderResult.dismiss().then()
          });  //Observable
      })
    })

  }

  navigateTo(componentName: string)
  {
    this.router.navigate([componentName]);
  }

}
