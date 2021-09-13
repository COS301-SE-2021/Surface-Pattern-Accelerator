import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { ICollectionsInterface } from '../../Interfaces/collections.interface';
import { CollectionsServiceService } from '../../services/collections-service.service';
import {Router} from "@angular/router";
import { LoadingController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import {CollectionBasicOperationsComponent} from "../../popovers/collection-basic-operations/collection-basic-operations.component"
import { MenuController } from '@ionic/angular';
import {CollorPalletComponent} from "../collor-pallet/collor-pallet.component";
import {ColorComponent} from "../color/color.component";
import {CollectionLayoutComponent} from "../../collection-layout/collection-layout.component";
import {MotifUploadComponent} from "../../popovers/motif-upload/motif-upload.component";

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss'],
})
export class CollectionsComponent implements OnInit {

  collections?: ICollectionsInterface; //the collections that get displayed, marked as optional
  activeComponent: string;
  //private componentRef: ComponentRef<any>;
  menuController: MenuController;

  constructor(private collectionsService: CollectionsServiceService, private router: Router, public loadingController: LoadingController, private popoverController: PopoverController) { }

  ngOnInit(): void
  {
    this.menuController = new MenuController();
    this.menuController.enable(true, 'main-content');
    this.getCollections();
    this.activeComponent = 'Collections';
    this.setActive("Collections");
   //  this.menuController = new MenuController();
   //  this.menuController.enable(true, 'main-content');
  //  this.getCollections();
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
  setActive(component){
    if(this.activeComponent == component)return;
    this.activeComponent = component;
    // let els = document.querySelector(".tab-links");
    // (<HTMLElement> els).style.color = "blue";
    // if(component == 'Color'){
    //   let container = document.getElementById('temp');
    //   container.innerText = '<app-color></app-color>';
    // }
    // else{
    //   let container = document.getElementById('temp');
    //   container.style.content = '<app-collection-layout></app-collection-layout> '
    // }
  }

  uploadFilePopover()
  {
    this.popoverController.create({
      component: MotifUploadComponent,
      translucent: true,
      cssClass: 'fullscreen'
    }).then(resPop => {
      resPop.present().then(presentRes => {
        return presentRes;

      });
    })
  }
  navigateTo(componentName: string)
  {
    this.router.navigate([componentName]);
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


}
