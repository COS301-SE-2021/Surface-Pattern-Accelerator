import {Component, OnDestroy, OnInit} from '@angular/core';
import { CollectionsServiceService } from '../../services/collections-service.service';
import {Router} from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';

import {ICollectionsContent} from '../../Interfaces/collectionContents.interface';

import { MenuController } from '@ionic/angular';

import {MotifUploadComponent} from "../../popovers/motif-upload/motif-upload.component";
import {ThemeServiceService} from "../../services/theme-service.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss'],
})
export class CollectionsComponent implements OnInit, OnDestroy {

  collections?: ICollectionsContent[] = []; //the collections that get displayed, marked as optional
  activeComponent: string;
  private subscription: Subscription;
  menuController: MenuController;

  background_dark: string;
  background_light: string;
  color_dark: string;
  color_light: string;
  secondaryBackground_dark: string = "#404040";
  secondaryBackground_light: string = "white";
  listener;
  // eslint-disable-next-line max-len
  constructor(private collectionsService: CollectionsServiceService, private router: Router, public loadingController: LoadingController, private popoverController: PopoverController, private themeService: ThemeServiceService)
  {

  }



  ngOnInit(): void
  {
    this.listener = this.themeService.darkModeChange;

    this.menuController = new MenuController();
    this.menuController.enable(true, 'main-content');
    this.getCollections();
    this.activeComponent = 'Collections';
    this.setActive("Collections");

    this.changeTheme();


    // this.themeService.isDarkMode.
    this.subscription = this.themeService.darkModeChange.subscribe(value => {
      this.changeTheme();
    });


  }
  ngOnDestroy() {
   this.subscription.unsubscribe();
  }

  CollectionOperations(ev: any)
  {
    // this.popoverController.create({
    //   component: CollectionBasicOperationsComponent,
    //   event: ev,
    //   translucent: true
    // }).then(resPop => {
    //   resPop.present().then(presentRes => {
    //     return presentRes;
    //   });
    // })
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


  loadCollection(collectionID: any) {
    console.log(collectionID)
    this.collectionsService.currentCollectionID = collectionID;
    this.router.navigate(['pattern']).then()
  }

  changeTheme(){
    let card =  document.getElementsByClassName('card');
    let heading  = document.getElementById('heading');
    let left =  document.getElementsByClassName('color');
    let right =  document.getElementsByClassName('right');
    let patternNum = document.getElementsByClassName('patterblock');
    let button = document.getElementById('addBtn');


    if(this.themeService.isDarkMode == false)
    {
      console.log('light');
      for(let i = 0 ; i < card.length ; i++){
        (<HTMLElement> card[i]).style.backgroundColor = "#F7F7F9";
      }
      let r = document.querySelector(':root');
      (<HTMLElement>r).style.setProperty('--mycolor', this.secondaryBackground_light);
      (<HTMLElement>r).style.setProperty('--shadowcolorDark', 'rgba(0,0,0,0.25)');
      (<HTMLElement>r).style.setProperty('--shadowcolorLight', 'rgba(0,0,0,0.23)');
      // for(let i = 0 ; i < left.length ; i++){
      //   (<HTMLElement> left[i]).style.backgroundColor = this.secondaryBackground_light;
      //
      // }

      (<HTMLElement> heading).style.color = "black";
      (<HTMLElement> button).style.color = "blue";



    }
    else{
      for(let i = 0 ; i < card.length ; i++){
        (<HTMLElement> card[i]).style.backgroundColor = "#181818";
        console.log('dark');
      }
      // for(let i = 0 ; i < left.length ; i++){
      //   (<HTMLElement> left[i]).style.backgroundColor = this.secondaryBackground_dark;
      // }
      let r = document.querySelector(':root');
      (<HTMLElement>r).style.setProperty('--mycolor', this.secondaryBackground_dark);
      (<HTMLElement>r).style.setProperty('--shadowcolorDark', 'rgba(255,255,255,0.25)');
      (<HTMLElement>r).style.setProperty('--shadowcolorLight', 'rgba(255,255,255,0.23)');
      (<HTMLElement> heading).style.color = "white";
      (<HTMLElement> button).style.color = "white";
    }
  }
}
