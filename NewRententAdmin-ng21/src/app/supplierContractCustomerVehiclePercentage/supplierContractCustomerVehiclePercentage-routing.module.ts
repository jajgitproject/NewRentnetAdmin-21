// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupplierContractCustomerVehiclePercentageComponent } from './supplierContractCustomerVehiclePercentage.component';

const routes: Routes = [
  {
    path: '',
    component: SupplierContractCustomerVehiclePercentageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierContractCustomerVehiclePercentageRoutingModule {}

