// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VehicleCategoryInfoComponent } from './VehicleCategoryInfo.component';

const routes: Routes = [
  {
    path: '',
    component: VehicleCategoryInfoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleCategoryInfoRoutingModule {}

