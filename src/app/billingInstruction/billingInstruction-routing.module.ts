// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillingInstructionComponent } from './billingInstruction.component';

const routes: Routes = [
  {
    path: '',
    component: BillingInstructionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillingInstructionRoutingModule {}

