// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RateViewForVendorLongTermRentalComponent } from './rateViewForVendorLongTermRental.component';

const routes: Routes = [
  {
    path: '',
    component: RateViewForVendorLongTermRentalComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RateViewForVendorLongTermRentalRoutingModule {}

