// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VehicleInterStateTaxComponent } from './vehicleInterStateTax.component';

const routes: Routes = [
  {
    path: '',
    component: VehicleInterStateTaxComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleInterStateTaxRoutingModule {}

