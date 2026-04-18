// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorContractCityTiersCityMappingComponent } from './vendorContractCityTiersCityMapping.component';

const routes: Routes = [
  {
    path: '',
    component: VendorContractCityTiersCityMappingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorContractCityTiersCityMappingRoutingModule {}

