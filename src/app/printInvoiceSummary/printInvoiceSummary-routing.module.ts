// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrintInvoiceSummaryComponent } from './printInvoiceSummary.component';

const routes: Routes = [
  {
    path: '',
    component: PrintInvoiceSummaryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrintInvoiceSummaryRoutingModule {}
