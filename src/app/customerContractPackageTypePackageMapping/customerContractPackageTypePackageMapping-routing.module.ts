// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerContractPackageTypePackageMappingComponent } from './customerContractPackageTypePackageMapping.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerContractPackageTypePackageMappingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerContractPackageTypePackageMappingRoutingModule {}

