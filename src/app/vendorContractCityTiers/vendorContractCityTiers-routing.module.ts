// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorContractCityTiersComponent } from './vendorContractCityTiers.component';

const routes: Routes = [
  {
    path: '',
    component: VendorContractCityTiersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorContractCityTiersRoutingModule {}

