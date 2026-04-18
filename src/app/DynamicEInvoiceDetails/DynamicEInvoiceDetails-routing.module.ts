// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DynamicEInvoiceDetailsComponent } from './DynamicEInvoiceDetails.component';


// import { DynamicEInvoiceDetailsComponent } from './DynamicEInvoiceDetails.component';

const routes: Routes = [
  {
    path: '',
    component: DynamicEInvoiceDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DynamicEInvoiceDetailsRoutingModule {}

