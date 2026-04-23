// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupplierContractSDCSelfDriveUnLimitedComponent } from './supplierContractSDCSelfDriveUnLimited.component';

const routes: Routes = [
  {
    path: '',
    component: SupplierContractSDCSelfDriveUnLimitedComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierContractSDCSelfDriveUnLimitedRoutingModule {}

