// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorContractLocalRateComponent } from './vendorContractLocalRate.component';

const routes: Routes = [
  {
    path: '',
    component: VendorContractLocalRateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorContractLocalRateRoutingModule {}

