// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorOutStationRoundTripRateComponent } from './vendorOutStationRoundTripRate.component';

const routes: Routes = [
  {
    path: '',
    component: VendorOutStationRoundTripRateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorOutStationRoundTripRateRoutingModule {}

