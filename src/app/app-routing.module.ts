import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CollectionsComponent } from './components/collections/collections.component';
import { CollectionCreatorComponent } from './components/collection-creator/collection-creator.component';
import { PatternComponent } from './components/pattern/pattern.component';
import { ImportComponent} from './components/import/import.component';
import { WorkareaComponent} from './components/workarea/workarea.component';
import { CollorPalletComponent } from './components/collor-pallet/collor-pallet.component';
import { LoginComponent } from './components/login/login.component';
import { LoginResponseComponent} from './components/login-response/login-response.component';
import { CanvasColoursComponent } from "./components/canvas-colours/canvas-colours.component";

const routes: Routes = [

  { path: 'login', component: LoginComponent},
  { path: '',    redirectTo: 'login',    pathMatch: 'full'  },
  { path: 'collections', component: CollectionsComponent}, //if a url matches this path then the appropriate component wil be displayed
  { path: 'collectionCreator', component: CollectionCreatorComponent},
  { path: 'pattern', component: PatternComponent},
  { path: 'import', component: ImportComponent },
  { path: 'workarea', component: WorkareaComponent },
  { path: 'colorpallet', component: CollorPalletComponent},
  { path: 'loginResponse', component: LoginResponseComponent },
  { path: 'canvasColours', component: CanvasColoursComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
