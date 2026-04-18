// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupplierContractSDCSelfDriveLimitedComponent } from './supplierContractSDCSelfDriveLimited.component';

const routes: Routes = [
  {
    path: '',
    component: SupplierContractSDCSelfDriveLimitedComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierContractSDCSelfDriveLimitedRoutingModule {}

