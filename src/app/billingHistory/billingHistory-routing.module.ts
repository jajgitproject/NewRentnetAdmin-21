// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillingHistoryComponent } from './billingHistory.component';

const routes: Routes = [
  {
    path: '',
    component: BillingHistoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillingHistoryRoutingModule {}

