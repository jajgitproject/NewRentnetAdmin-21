// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RateViewForLocalLumpsumContractComponent } from './rateViewForLocalLumpsumContract.component';

const routes: Routes = [
  {
    path: '',
    component: RateViewForLocalLumpsumContractComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RateViewForLocalLumpsumContractRoutingModule {}

