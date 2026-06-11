// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoiceSummaryComponent } from './invoiceSummary.component';

const routes: Routes = [
  {
    path: '',
    component: InvoiceSummaryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceSummaryRoutingModule {}
