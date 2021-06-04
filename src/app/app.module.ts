import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {ImportComponent} from "./import/import.component";
import { SVGeditorComponent } from './svgeditor/svgeditor.component';


@NgModule({
  declarations: [
    AppComponent,
      ImportComponent,
      SVGeditorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent, ImportComponent]
})
export class AppModule { }
