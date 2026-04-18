// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupplierContractCDCLocalOnDemandComponent } from './supplierContractCDCLocalOnDemand.component';

const routes: Routes = [
  {
    path: '',
    component: SupplierContractCDCLocalOnDemandComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierContractCDCLocalOnDemandRoutingModule {}

