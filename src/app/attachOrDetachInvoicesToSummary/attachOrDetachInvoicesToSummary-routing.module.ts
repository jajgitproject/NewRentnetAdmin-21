// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AttachOrDetachInvoicesToSummaryComponent } from './attachOrDetachInvoicesToSummary.component';

const routes: Routes = [
  {
    path: '',
    component: AttachOrDetachInvoicesToSummaryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttachOrDetachInvoicesToSummaryRoutingModule {}
