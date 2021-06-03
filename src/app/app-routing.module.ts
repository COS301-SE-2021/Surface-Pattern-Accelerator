import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImportComponent} from "./import/import.component";
// import { PatternComponent } from "./pattern/pattern.component";


const routes: Routes = [
  { path: 'import', component: ImportComponent },
  // { path: 'pattern', component: PatternComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
