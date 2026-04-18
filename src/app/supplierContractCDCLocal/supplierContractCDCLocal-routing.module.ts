// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupplierContractCDCLocalComponent } from './supplierContractCDCLocal.component';

const routes: Routes = [
  {
    path: '',
    component: SupplierContractCDCLocalComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierContractCDCLocalRoutingModule {}

