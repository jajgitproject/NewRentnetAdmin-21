// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupplierRateCardSupplierMappingComponent } from './supplierRateCardSupplierMapping.component';

const routes: Routes = [
  {
    path: '',
    component: SupplierRateCardSupplierMappingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierRateCardSupplierMappingRoutingModule {}

