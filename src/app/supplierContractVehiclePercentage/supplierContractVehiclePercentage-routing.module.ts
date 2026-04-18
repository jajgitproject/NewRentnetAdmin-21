// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupplierContractVehiclePercentageComponent } from './supplierContractVehiclePercentage.component';

const routes: Routes = [
  {
    path: '',
    component: SupplierContractVehiclePercentageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierContractVehiclePercentageRoutingModule {}

