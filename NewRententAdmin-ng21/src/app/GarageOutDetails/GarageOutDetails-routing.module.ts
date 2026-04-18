// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GarageOutDetailsComponent } from './GarageOutDetails.component';

const routes: Routes = [
  {
    path: '',
    component: GarageOutDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GarageOutDetailsRoutingModule {}

