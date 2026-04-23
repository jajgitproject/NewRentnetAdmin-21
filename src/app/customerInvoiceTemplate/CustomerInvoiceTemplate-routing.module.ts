// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerInvoiceTemplateComponent } from './CustomerInvoiceTemplate.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerInvoiceTemplateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerInvoiceTemplateRoutingModule {}

