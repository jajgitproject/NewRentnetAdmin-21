// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContractPackageTypeMappingComponent } from './contractPackageTypeMapping.component';


const routes: Routes = [
  {
    path: '',
    component: ContractPackageTypeMappingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractPackageTypeMappingRoutingModule {}

