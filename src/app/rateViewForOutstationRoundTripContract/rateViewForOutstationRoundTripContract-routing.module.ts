// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RateViewForOutstationRoundTripContractComponent } from './rateViewForOutstationRoundTripContract.component';

const routes: Routes = [
  {
    path: '',
    component: RateViewForOutstationRoundTripContractComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RateViewForOutstationRoundTripContractRoutingModule {}

