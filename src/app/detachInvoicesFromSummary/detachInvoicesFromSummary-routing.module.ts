// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetachInvoicesFromSummaryComponent } from './detachInvoicesFromSummary.component';

const routes: Routes = [
  {
    path: '',
    component: DetachInvoicesFromSummaryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetachInvoicesFromSummaryRoutingModule {}
