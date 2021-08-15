import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
//  Removed ReactiveFormsModule from @angular/forms, it was unused
import {FormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import { CollectionsComponent } from './components/collections/collections.component';
import { CollectionCreatorComponent } from './components/collection-creator/collection-creator.component';
import { NewCollectionComponent } from './components/collection-creator/new-collection/new-collection.component';
import { HttpClientModule } from '@angular/common/http';

//import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
// import { InMemoryDataService } from './in-memory-data.service';
import { PatternComponent } from './components/pattern/pattern.component';
import { ImportComponent} from './components/import/import.component';
import { LoginComponent } from "./components/login/login.component";
//import { NavbarComponent } from "./components/navbar/navbar.component";
import { ColorComponent } from './components/color/color.component';
import { MainComponent } from './components/launchpage/main/main.component';
import { BodyComponent } from './components/launchpage/body/body.component';
import { CollorPalletComponent} from './components/collor-pallet/collor-pallet.component';

import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { PreviewComponent } from './components/preview/preview.component';
import { ExportPopoverComponent } from './components/export-popover/export-popover.component';
import { GoogleLoginProvider, /*SocialAuthService,*/ SocialLoginModule} from "angularx-social-login";
import { CanvasColoursComponent } from "./components/canvas-colours/canvas-colours.component";


import {MatSidenavModule} from "@angular/material/sidenav";
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
//import { MaterialModule } from './material/material.module';




@NgModule({
  declarations: [
    AppComponent,
    CollectionsComponent,
    CollectionCreatorComponent,
    PatternComponent,
    AppComponent,
    ImportComponent,
    PreviewComponent,
    ExportPopoverComponent,
    LoginComponent,
    CanvasColoursComponent,
    NewCollectionComponent,
    //NavbarComponent,
    ColorComponent,
    MainComponent,
    BodyComponent,
    CollorPalletComponent
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    SocialLoginModule,
    // HttpClientInMemoryWebApiModule.forRoot(
    //   InMemoryDataService, { dataEncapsulation: false }
    // ),
    IonicModule.forRoot(), AppRoutingModule, BrowserAnimationsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              // replace this with your google client id
              '838530253471-o3arioj6ta566o6eg8140npcvb7a59tv.apps.googleusercontent.com'
            )
          }
        ]
      }
    },
    /*AuthGuardService*/], //auth guard / routing guard
  bootstrap: [AppComponent],
})
export class AppModule {}
