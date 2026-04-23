// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoiceDetachComponent } from './invoiceDetach.component';


const routes: Routes = [
  {
    path: '',
    component: InvoiceDetachComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceDetachRoutingModule {}

