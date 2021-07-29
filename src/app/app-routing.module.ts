import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CollectionsComponent } from './components/collections/collections.component';
import { CollectionCreatorComponent } from './components/collection-creator/collection-creator.component';
import { PatternComponent } from './components/pattern/pattern.component';
import { ImportComponent} from './components/import/import.component';
import { LoginComponent } from './components/login/login.component';
import { NewCollectionComponent } from './components/collection-creator/new-collection/new-collection.component'
import { CollectionThemeComponent } from './components/collection-creator/collection-theme/collection-theme.component'


const routes: Routes = [
  { path: 'home',    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)  },
  { path: 'login', component: LoginComponent},
  { path: '',    redirectTo: 'collections',    pathMatch: 'full'  },
  { path: 'collections', component: CollectionsComponent}, //if a url matches this path then the appropriate component wil be displayed
  { path: 'collectionCreator', component: CollectionCreatorComponent},
  { path: 'pattern', component: PatternComponent},
  { path: 'import', component: ImportComponent },
  { path: 'newCollection', component: NewCollectionComponent },
  { path: 'collectionTheme', component: CollectionThemeComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
