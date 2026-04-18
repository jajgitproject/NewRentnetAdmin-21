// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DynamicEInvoiceComponent } from './dynamicEInvoice.component';


const routes: Routes = [
  {
    path: '',
    component: DynamicEInvoiceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DynamicEInvoiceRoutingModule {}

