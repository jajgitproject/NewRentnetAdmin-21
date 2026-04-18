// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CDCOutStationRoundTripRateComponent } from './cdcOutStationRoundTripRate.component';

const routes: Routes = [
  {
    path: '',
    component: CDCOutStationRoundTripRateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CDCOutStationRoundTripRateRoutingModule {}

