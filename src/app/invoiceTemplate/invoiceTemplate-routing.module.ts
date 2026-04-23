// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoiceTemplateComponent } from './invoiceTemplate.component';

const routes: Routes = [
  {
    path: '',
    component: InvoiceTemplateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceTemplateRoutingModule {}

