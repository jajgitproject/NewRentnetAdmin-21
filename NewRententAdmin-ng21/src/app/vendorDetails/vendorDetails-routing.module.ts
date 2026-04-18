// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorDetailsComponent } from './vendorDetails.component';

const routes: Routes = [
  {
    path: '',
    component: VendorDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorDetailsRoutingModule {}

