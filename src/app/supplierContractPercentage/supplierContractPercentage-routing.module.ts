// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupplierContractPercentageComponent } from './supplierContractPercentage.component';

const routes: Routes = [
  {
    path: '',
    component: SupplierContractPercentageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierContractPercentageRoutingModule {}

