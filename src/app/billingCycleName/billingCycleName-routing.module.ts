// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillingCycleNameComponent } from './billingCycleName.component';


const routes: Routes = [
  {
    path: '',
    component: BillingCycleNameComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillingCycleNameRoutingModule {}

