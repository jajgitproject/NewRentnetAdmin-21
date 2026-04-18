// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorPaymentMappingComponent } from './vendorPaymentMapping.component';

const routes: Routes = [
  {
    path: '',
    component: VendorPaymentMappingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorPaymentMappingRoutingModule {}

