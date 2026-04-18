// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorContractPackageTypeMappingComponent } from './vendorContractPackageTypeMapping.component';


const routes: Routes = [
  {
    path: '',
    component: VendorContractPackageTypeMappingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorContractPackageTypeMappingRoutingModule {}

