// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupplierTypeComponent } from './supplierType.component';

const routes: Routes = [
  {
    path: '',
    component: SupplierTypeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierTypeRoutingModule {}

