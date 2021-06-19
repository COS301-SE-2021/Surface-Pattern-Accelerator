import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { CollectionsComponent } from './components/collections/collections.component';
import { CollectionCreatorComponent } from './components/collection-creator/collection-creator.component';
import { HttpClientModule } from '@angular/common/http';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
// import { InMemoryDataService } from './in-memory-data.service';
import { PatternComponent } from './components/pattern/pattern.component';
import { ImportComponent} from './components/import/import.component';
import { LoginComponent } from "./components/login/login.component";


import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import {GoogleLoginProvider, SocialAuthService, SocialLoginModule} from "angularx-social-login";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material';



@NgModule({
  declarations: [
    AppComponent,
    CollectionsComponent,
    CollectionCreatorComponent,
    PatternComponent,
    AppComponent,
    ImportComponent,
    LoginComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    SocialLoginModule,
    MatButtonModule,
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
