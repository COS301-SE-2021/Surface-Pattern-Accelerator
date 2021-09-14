import { Component, OnInit } from '@angular/core';
import {LoadingController, MenuController, PopoverController} from "@ionic/angular";
import {CollectionBasicOperationsComponent} from "../popovers/collection-basic-operations/collection-basic-operations.component";
import {CollectionsServiceService} from "../services/collections-service.service";
import {Router} from "@angular/router";
// import {ICollectionsInterface} from "../Interfaces/collections.interface";

@Component({
  selector: 'app-collection-layout',
  templateUrl: './collection-layout.component.html',
  styleUrls: ['./collection-layout.component.scss'],
})
export class CollectionLayoutComponent implements OnInit {
  // collections?: ICollectionsInterface; //the collections that get displayed, marked as optional
  menuController: MenuController;
  constructor(private collectionsService: CollectionsServiceService, private router: Router, public loadingController: LoadingController, private popoverController: PopoverController) { }

  ngOnInit(): void
  {
    this.menuController = new MenuController();
    this.menuController.enable(true, 'main-content');
    this.getCollections();
  }

  CollectionOperations(ev: any)
  {
    this.popoverController.create({
      component: CollectionBasicOperationsComponent,
      event: ev,
      translucent: true
    }).then(resPop => {
      resPop.present().then(presentRes => {
        return presentRes;
      });
    })
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
            //this.collections = collections
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
