// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerContractCityTiersCityMappingComponent } from './customerContractCityTiersCityMapping.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerContractCityTiersCityMappingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerContractCityTiersCityMappingRoutingModule {}

