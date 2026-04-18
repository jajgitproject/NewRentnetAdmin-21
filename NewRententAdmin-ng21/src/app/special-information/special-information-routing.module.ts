// @ts-nocheck
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SpecialinformationComponent } from './special-information.component';


const routes: Routes = [
  {
    path: '',
    component: SpecialinformationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpecialinformationRoutingModule {}

