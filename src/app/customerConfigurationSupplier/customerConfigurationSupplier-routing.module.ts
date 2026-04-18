// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerConfigurationSupplierComponent } from './customerConfigurationSupplier.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerConfigurationSupplierComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerConfigurationSupplierRoutingModule {}

