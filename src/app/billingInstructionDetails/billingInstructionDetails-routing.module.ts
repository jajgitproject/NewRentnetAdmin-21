// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillingInstructionDetailsComponent } from './billingInstructionDetails.component';

const routes: Routes = [
  {
    path: '',
    component: BillingInstructionDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillingInstructionDetailsRoutingModule {}

