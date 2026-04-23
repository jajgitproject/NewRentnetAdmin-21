// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupplierContractSDCSelfDriveHourlyUnlimitedComponent } from './supplierContractSDCSelfDriveHourlyUnlimited.component';

const routes: Routes = [
  {
    path: '',
    component: SupplierContractSDCSelfDriveHourlyUnlimitedComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierContractSDCSelfDriveHourlyUnlimitedRoutingModule {}

