// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RateViewForOutstationOneWayTripVendorContractComponent } from './rateViewForOutstationOneWayTripVendorContract.component';

const routes: Routes = [
  {
    path: '',
    component: RateViewForOutstationOneWayTripVendorContractComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RateViewForOutstationOneWayTripVendorContractRoutingModule {}

