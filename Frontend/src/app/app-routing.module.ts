import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CollectionsComponent } from './components/collections/collections.component';
import { CollectionCreatorComponent } from './components/collection-creator/collection-creator.component';
import { PatternComponent } from './components/pattern/pattern.component';

import { ColorPaletteComponent} from './components/color-palette/color-palette.component';
import { CanvasColoursComponent } from './components/canvas-colours/canvas-colours.component';
import {PreviewComponent} from './components/preview/preview.component';
import { LoginComponent } from './components/login/login.component';
import { LoginResponseComponent} from './components/login-response/login-response.component';
import { NewCollectionComponent } from './popovers/new-collection/new-collection.component';
import { MainComponent } from './components/launchpage/main/main.component';
import {StyleTransferComponent} from './components/style-transfer/style-transfer.component';

//import { ExportPopoverComponent } from './components/export-popover/export-popover.component';
import {GLoginComponent} from './components/g-login/g-login.component';
import {MotifEditorComponent} from './components/motif-editor/motif-editor.component';
import {PaymentComponent} from './components/payment/payment.component';
import{ PaymentGuardGuard} from './services/payment-guard.guard';
import { HelpComponent } from './components/help/help.component';
import {NavbarComponent} from './components/navbar/navbar.component';

const routes: Routes = [

  { path: '', component: MainComponent},
  { path: 'login', component: LoginComponent},
  // eslint-disable-next-line max-len
  { path: 'collections', component: CollectionsComponent,canActivate: [PaymentGuardGuard]}, //if a url matches this path then the appropriate component wil be displayed
  { path: 'collectionCreator', component: CollectionCreatorComponent},
  { path: 'color-palette', component: ColorPaletteComponent,canActivate: [PaymentGuardGuard]},
  { path: 'pattern', component: PatternComponent},
  { path: 'navbar', component: NavbarComponent },
  { path: 'loginResponse', component: LoginResponseComponent },
  { path: 'canvasColours', component: CanvasColoursComponent,canActivate: [PaymentGuardGuard] },
  { path: 'preview', component: PreviewComponent },
  { path: 'newCollection', component: NewCollectionComponent },
  { path: 'style-transfer', component: StyleTransferComponent,canActivate: [PaymentGuardGuard]},
  { path: 'newCollection', component: NewCollectionComponent },
  { path: 'glogin', component: GLoginComponent},
  { path: 'motifEditor', component: MotifEditorComponent}, //TODO: potentially add route same as pattern component
  { path: 'payment', component: PaymentComponent},
  { path: 'help', component: HelpComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
