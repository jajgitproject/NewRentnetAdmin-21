// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorLocalTransferRateComponent } from './vendorLocalTransferRate.component';


const routes: Routes = [
  {
    path: '',
    component:  VendorLocalTransferRateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class  VendorLocalTransferRateRoutingModule {}

