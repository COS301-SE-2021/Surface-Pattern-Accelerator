import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {ImportComponent} from "./import/import.component";
import { PatternComponent } from './pattern/pattern.component';

@NgModule({
  declarations: [
    AppComponent,
      ImportComponent,
      PatternComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent, ImportComponent]
})
export class AppModule { }
