// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RateViewForVendorLocalTransferRateComponent } from './rateViewForVendorLocalTransferRate.component';

const routes: Routes = [
  {
    path: '',
    component: RateViewForVendorLocalTransferRateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RateViewForVendorLocalTransferRateRoutingModule {}

