// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoiceHomeComponent } from './invoiceHome.component';

const routes: Routes = [
  {
    path: '',
    component: InvoiceHomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceHomeRoutingModule {}

