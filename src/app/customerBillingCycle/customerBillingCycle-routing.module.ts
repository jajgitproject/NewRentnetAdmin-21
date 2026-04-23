// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerBillingCycleComponent } from './customerBillingCycle.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerBillingCycleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerBillingCycleRoutingModule {}

