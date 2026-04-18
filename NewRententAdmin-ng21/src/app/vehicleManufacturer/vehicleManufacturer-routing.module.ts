// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VehicleManufacturerComponent } from './vehicleManufacturer.component';

const routes: Routes = [
  {
    path: '',
    component: VehicleManufacturerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleManufacturerRoutingModule {}

