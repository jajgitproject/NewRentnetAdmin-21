// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupplierContractCustomerCityPercentageComponent } from './supplierContractCustomerCityPercentage.component';

const routes: Routes = [
  {
    path: '',
    component: SupplierContractCustomerCityPercentageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierContractCustomerCityPercentageRoutingModule {}

