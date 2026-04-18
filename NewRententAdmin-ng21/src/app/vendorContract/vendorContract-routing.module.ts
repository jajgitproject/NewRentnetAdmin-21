// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorContractComponent } from './vendorContract.component';

const routes: Routes = [
  {
    path: '',
    component: VendorContractComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorContractRoutingModule {}

