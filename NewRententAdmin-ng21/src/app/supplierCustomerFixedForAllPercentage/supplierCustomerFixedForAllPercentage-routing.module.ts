// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupplierCustomerFixedForAllPercentageComponent } from './supplierCustomerFixedForAllPercentage.component';

const routes: Routes = [
  {
    path: '',
    component: SupplierCustomerFixedForAllPercentageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierCustomerFixedForAllPercentageRoutingModule {}

