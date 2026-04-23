// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerBillingExecutiveComponent } from './customerBillingExecutive.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerBillingExecutiveComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerBillingExecutiveRoutingModule {}

