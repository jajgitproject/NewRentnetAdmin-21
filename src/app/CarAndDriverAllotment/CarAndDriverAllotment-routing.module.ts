// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CarAndDriverAllotmentComponent } from './CarAndDriverAllotment.component';

const routes: Routes = [
  {
    path: '',
    component: CarAndDriverAllotmentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarAndDriverAllotmentRoutingModule {}

