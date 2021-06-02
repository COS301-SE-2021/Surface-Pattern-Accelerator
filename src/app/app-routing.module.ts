import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollectionsComponent } from './collections/collections.component';
import { CollectionCreatorComponent } from './collection-creator/collection-creator.component'


const routes: Routes = [
  { path: '', redirectTo: '/collections', pathMatch: 'full' },
  {path: 'collections', component: CollectionsComponent}, //if a url matches this path then the appropriate component wil be displayed
  {path: 'collectionCreator', component: CollectionCreatorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
