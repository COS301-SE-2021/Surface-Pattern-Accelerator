import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CollectionsComponent } from './components/collections/collections.component';
import { CollectionCreatorComponent } from './components/collection-creator/collection-creator.component';
import { PatternComponent } from './components/pattern/pattern.component';
import { WorkareaComponent} from './components/workarea/workarea.component';
import { CollorPalletComponent } from './components/collor-pallet/collor-pallet.component';
import { CanvasColoursComponent } from './components/canvas-colours/canvas-colours.component';
import {PreviewComponent} from './components/preview/preview.component';
import { LoginComponent } from './components/login/login.component';
import { LoginResponseComponent} from './components/login-response/login-response.component';
import { ColorComponent} from './components/color/color.component';
import { NewCollectionComponent } from './components/collection-creator/new-collection/new-collection.component';
import { MainComponent } from './components/launchpage/main/main.component';
//import { ExportPopoverComponent } from './components/export-popover/export-popover.component';
import {GLoginComponent} from './components/g-login/g-login.component'
import {MotifEditorComponent} from "./components/motif-editor/motif-editor.component";


const routes: Routes = [

  { path: '', component: MainComponent},
  { path: 'login', component: LoginComponent},
  // { path: '',    redirectTo: 'login',    pathMatch: 'full'  },
  { path: 'collections', component: CollectionsComponent}, //if a url matches this path then the appropriate component wil be displayed
  { path: 'collectionCreator', component: CollectionCreatorComponent},
  { path: 'colorpallet', component: CollorPalletComponent},
  { path: 'pattern/:collectionID/:collectionName', component: PatternComponent},
  { path: 'workarea', component: WorkareaComponent },
  { path: 'loginResponse', component: LoginResponseComponent },
  { path: 'canvasColours', component: CanvasColoursComponent },
  { path: 'preview', component: PreviewComponent },
  { path: 'color', component: ColorComponent},
  { path: 'newCollection', component: NewCollectionComponent },
  { path: 'glogin', component: GLoginComponent},
  { path: 'motifEditor', component: MotifEditorComponent} //TODO: potentially add route same as pattern component
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
