// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupplierContractPackageTypePercentageComponent } from './supplierContractPackageTypePercentage.component';

const routes: Routes = [
  {
    path: '',
    component: SupplierContractPackageTypePercentageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierContractPackageTypePercentageRoutingModule {}

