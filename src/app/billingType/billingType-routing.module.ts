// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillingTypeComponent } from './billingType.component';

const routes: Routes = [
  {
    path: '',
    component: BillingTypeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillingTypeRoutingModule {}

