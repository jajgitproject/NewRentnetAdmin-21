// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RateViewForLocalContractComponent } from './rateViewForLocalContract.component';

const routes: Routes = [
  {
    path: '',
    component: RateViewForLocalContractComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RateViewForLocalContractRoutingModule {}

