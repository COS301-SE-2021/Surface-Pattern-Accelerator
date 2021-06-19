import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CollectionsComponent } from './components/collections/collections.component';
import { CollectionCreatorComponent } from './components/collection-creator/collection-creator.component';
import { HttpClientModule } from '@angular/common/http';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
// import { InMemoryDataService } from './in-memory-data.service';
import { PatternComponent } from './components/pattern/pattern.component';
import {ImportComponent} from './components/import/import.component';
import {CollorPalletComponent} from './components/collor-pallet/collor-pallet.component';

import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';




@NgModule({
  declarations: [
    AppComponent,
    CollectionsComponent,
    CollectionCreatorComponent,
    PatternComponent,
    AppComponent,
    ImportComponent,
    CollorPalletComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    // HttpClientInMemoryWebApiModule.forRoot(
    //   InMemoryDataService, { dataEncapsulation: false }
    // ),
    IonicModule.forRoot(), AppRoutingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
