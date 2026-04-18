// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorLocalLumpsumRateComponent } from './vendorLocalLumpsumRate.component';



const routes: Routes = [
  {
    path: '',
    component:  VendorLocalLumpsumRateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class  VendorLocalLumpsumRateRoutingModule {}

