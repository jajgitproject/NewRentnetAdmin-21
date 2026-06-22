// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerContractPackageTypeComponent } from './customerContractPackageType.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerContractPackageTypeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerContractPackageTypeRoutingModule {}

