import { NgModule } from '@angular/core';
// @ts-ignore
import {MatButtonModule} from '@angular/material';

const materialComponents = [
  MatButtonModule
];

@NgModule({
  imports: [
    MatButtonModule,
    materialComponents
  ],
  exports:[
    materialComponents
  ]
})
export class MaterialModule { }
