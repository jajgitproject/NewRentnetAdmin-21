// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupplierCityMappingComponent } from './supplierCityMapping.component';

const routes: Routes = [
  {
    path: '',
    component: SupplierCityMappingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierCityMappingRoutingModule {}

