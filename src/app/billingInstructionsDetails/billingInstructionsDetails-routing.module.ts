// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillingInstructionsDetailsComponent } from './billingInstructionsDetails.component';

const routes: Routes = [
  {
    path: '',
    component: BillingInstructionsDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillingInstructionsDetailsRoutingModule {}

