// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorOutStationOneWayTripRateComponent } from './vendorOutStationOneWayTripRate.component';

const routes: Routes = [
  {
    path: '',
    component: VendorOutStationOneWayTripRateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorOutStationOneWayTripRateRoutingModule {}

