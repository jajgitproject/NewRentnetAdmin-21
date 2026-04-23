// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupplierContractCustomerPackageTypePercentageComponent } from './supplierContractCustomerPackageTypePercentage.component';

const routes: Routes = [
  {
    path: '',
    component: SupplierContractCustomerPackageTypePercentageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierContractCustomerPackageTypePercentageRoutingModule {}

