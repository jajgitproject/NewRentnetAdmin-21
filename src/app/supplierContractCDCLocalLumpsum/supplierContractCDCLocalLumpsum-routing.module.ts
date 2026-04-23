// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupplierContractCDCLocalLumpsumComponent } from './supplierContractCDCLocalLumpsum.component';

const routes: Routes = [
  {
    path: '',
    component: SupplierContractCDCLocalLumpsumComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierContractCDCLocalLumpsumRoutingModule {}

