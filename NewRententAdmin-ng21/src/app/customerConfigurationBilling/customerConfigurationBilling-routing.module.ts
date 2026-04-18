// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerConfigurationBillingComponent } from './customerConfigurationBilling.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerConfigurationBillingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerConfigurationBillingRoutingModule {}

