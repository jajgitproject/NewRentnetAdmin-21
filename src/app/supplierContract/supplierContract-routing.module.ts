// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupplierContractComponent } from './supplierContract.component';

const routes: Routes = [
  {
    path: '',
    component: SupplierContractComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierContractRoutingModule {}

