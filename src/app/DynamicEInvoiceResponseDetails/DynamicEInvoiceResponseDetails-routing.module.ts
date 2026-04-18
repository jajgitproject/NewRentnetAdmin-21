// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DynamicEInvoiceResponseDetailsComponent } from './DynamicEInvoiceResponseDetails.component';


// import { DynamicEInvoiceResponseDetailsComponent } from './DynamicEInvoiceResponseDetails.component';

const routes: Routes = [
  {
    path: '',
    component: DynamicEInvoiceResponseDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DynamicEInvoiceResponseDetailsRoutingModule {}

