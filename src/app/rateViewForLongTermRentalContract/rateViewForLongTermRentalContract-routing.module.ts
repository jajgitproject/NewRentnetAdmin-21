// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RateViewForLongTermRentalContractComponent } from './rateViewForLongTermRentalContract.component';

const routes: Routes = [
  {
    path: '',
    component: RateViewForLongTermRentalContractComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RateViewForLongTermRentalContractRoutingModule {}

