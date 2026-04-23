// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerDecimalValuesOnInvoiceComponent } from './customerDecimalValuesOnInvoice.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerDecimalValuesOnInvoiceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerDecimalValuesOnInvoiceRoutingModule {}

