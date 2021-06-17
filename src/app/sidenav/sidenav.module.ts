import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SidenavPageRoutingModule } from './sidenav-routing.module';

import { SidenavPage } from './sidenav.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SidenavPageRoutingModule
  ],
  declarations: [SidenavPage]
})
export class SidenavPageModule {}
