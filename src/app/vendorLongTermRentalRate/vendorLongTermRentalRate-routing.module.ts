// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorLongTermRentalRateComponent } from './vendorLongTermRentalRate.component';

const routes: Routes = [
  {
    path: '',
    component: VendorLongTermRentalRateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorLongTermRentalRateRoutingModule {}

