// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RateViewForOutstationRoundTripVendorContractComponent } from './rateViewForOutstationRoundTripVendorContract.component';

const routes: Routes = [
  {
    path: '',
    component: RateViewForOutstationRoundTripVendorContractComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RateViewForOutstationRoundTripVendorContractRoutingModule {}

