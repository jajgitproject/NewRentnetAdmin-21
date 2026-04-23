// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CDCOutStationLumpsumRateComponent } from './cdcOutStationLumpsumRate.component';

const routes: Routes = [
  {
    path: '',
    component: CDCOutStationLumpsumRateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CDCOutStationLumpsumRateRoutingModule {}

