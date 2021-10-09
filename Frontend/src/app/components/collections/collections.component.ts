import {Component, OnDestroy, OnInit} from '@angular/core';
import { CollectionsServiceService } from '../../services/collections-service.service';
import {Router} from '@angular/router';
import {LoadingController, ModalController} from '@ionic/angular';
import { PopoverController } from '@ionic/angular';

import {ICollectionsContent} from '../../Interfaces/collectionContents.interface';

import { MenuController } from '@ionic/angular';

import {MotifUploadComponent} from '../../popovers/motif-upload/motif-upload.component';
import {ThemeServiceService} from '../../services/theme-service.service';
import {CollectionOperationPopoverComponent} from '../../popovers/collection-operation-popover/collection-operation-popover.component';
import {NewCollectionComponent} from '../../popovers/new-collection/new-collection.component';



import {Subscription} from 'rxjs';
import {GLoginService} from '../../services/g-login.service';

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
  listener_signin;
  singedIn;
  listener_payment;
  payed;
  // eslint-disable-next-line max-len
  constructor(private collectionsService: CollectionsServiceService, private router: Router, public loadingController: LoadingController, private popoverController: PopoverController, private themeService: ThemeServiceService , private modal: ModalController, private gLogin: GLoginService)
  {

  }



  ngOnInit(): void
  {
    this.singedIn = this.gLogin.singedIn;
    this.listener_signin = this.gLogin.singedIn.subscribe(value=>{
      this.singedIn = value;
      console.log('value changed to');
      console.log(value);

    });

    this.payed = this.gLogin.hasPaid;
    this.listener_payment = this.gLogin.payed.subscribe(value=>{
      this.payed = value;
      console.log('value changed to');
      console.log(value);

    });
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




  newCollectionPopOver(){
    this.popoverController.create({
      component: NewCollectionComponent,
      translucent: true,
      cssClass: 'fullscreen'
    }).then(resPop => {
      resPop.present().then(presentRes => {
        return presentRes;
      });
    })
  }



  ngOnDestroy() {
   this.subscription.unsubscribe();
  }

  async CollectionOperations(ev: any, collection, index )
  {

    const collections = document.querySelectorAll('.square');

    const popover = await this.popoverController.create({
      component: CollectionOperationPopoverComponent,
      componentProps: {key1: collection},
      event: ev,
      translucent: true
    })

    popover.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        if (dataReturned.data == "DELETED") {
          (<HTMLElement>collections[index]).style.display = 'none';

          // dataReturned.data;
          // console.log(dataReturned);
        }
        // this.loadingController.dismiss();
      }

    });
    return await popover.present();


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

  deleteCollection(collectionContent: ICollectionsContent)
  {
    this.collectionsService.deleteCollection(collectionContent)
      .subscribe(res => {console.log(res)})
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
      (<HTMLElement>r).style.setProperty('--borderColor', 'grey');

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
      (<HTMLElement>r).style.setProperty('--borderColor', '#FFF');
      (<HTMLElement> heading).style.color = "white";
      (<HTMLElement> button).style.color = "white";
    }
  }

  details(){
    const user: gapi.auth2.GoogleUser = JSON.parse(sessionStorage.getItem('user')).user;
    console.log(user.getId());
  }

  hasPaid(){
    console.log(this.gLogin.hasPaid);
  }

  getUserName(){
    if(sessionStorage.getItem('token'))
    {return JSON.parse(sessionStorage.getItem('token')).name;}
    else
    {this.gLogin.singedIn.next(false);}
  }


  toggleTheme(event){
    if(event.detail.checked){
      document.body.setAttribute('color-theme', 'dark');
      this.themeService.makeDark(true);
      this.themeService.darkModeChange.next(true);
      localStorage.setItem('theme', 'dark');
    }
    else{
      document.body.setAttribute('color-theme', 'light');
      this.themeService.makeDark(false);
      this.themeService.darkModeChange.next(false);
      localStorage.setItem('theme', 'light');
    }
  }
}
