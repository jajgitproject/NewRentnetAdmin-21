// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VehicleCategoryTargetComponent } from './vehicleCategoryTarget.component';

const routes: Routes = [
  {
    path: '',
    component: VehicleCategoryTargetComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleCategoryTargetRoutingModule {}

