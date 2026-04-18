// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerAllowedPackageTypesInCDPComponent } from './customerAllowedPackageTypesInCDP.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerAllowedPackageTypesInCDPComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerAllowedPackageTypesInCDPRoutingModule {}

