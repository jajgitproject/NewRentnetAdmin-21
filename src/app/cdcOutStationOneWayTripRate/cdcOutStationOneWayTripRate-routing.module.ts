// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CDCOutStationOneWayTripRateComponent } from './cdcOutStationOneWayTripRate.component';

const routes: Routes = [
  {
    path: '',
    component: CDCOutStationOneWayTripRateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CDCOutStationOneWayTripRateRoutingModule {}

