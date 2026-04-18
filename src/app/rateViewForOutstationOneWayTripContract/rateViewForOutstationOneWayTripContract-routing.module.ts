// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RateViewForOutstationOneWayTripContractComponent } from './rateViewForOutstationOneWayTripContract.component';

const routes: Routes = [
  {
    path: '',
    component: RateViewForOutstationOneWayTripContractComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RateViewForOutstationOneWayTripContractRoutingModule {}

