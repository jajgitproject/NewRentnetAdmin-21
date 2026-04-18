// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoiceAttachDetachComponent } from './invoiceAttachDetach.component';


const routes: Routes = [
  {
    path: '',
    component: InvoiceAttachDetachComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceAttachDetachRoutingModule {}

