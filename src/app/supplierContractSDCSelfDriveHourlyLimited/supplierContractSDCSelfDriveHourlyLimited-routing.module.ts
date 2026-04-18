// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupplierContractSDCSelfDriveHourlyLimitedComponent } from './supplierContractSDCSelfDriveHourlyLimited.component';

const routes: Routes = [
  {
    path: '',
    component: SupplierContractSDCSelfDriveHourlyLimitedComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierContractSDCSelfDriveHourlyLimitedRoutingModule {}

