// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RateViewForVendorLocalLumpsumRateComponent } from './rateViewForVendorLocalLumpsumRatecomponent';


const routes: Routes = [
  {
    path: '',
    component: RateViewForVendorLocalLumpsumRateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RateViewForVendorLocalLumpsumRateRoutingModule {}

