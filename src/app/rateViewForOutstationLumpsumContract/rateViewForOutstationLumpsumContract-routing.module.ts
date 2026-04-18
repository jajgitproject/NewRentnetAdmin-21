// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RateViewForOutstationLumpsumContractComponent } from './rateViewForOutstationLumpsumContract.component';

const routes: Routes = [
  {
    path: '',
    component: RateViewForOutstationLumpsumContractComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RateViewForOutstationLumpsumContractRoutingModule {}

