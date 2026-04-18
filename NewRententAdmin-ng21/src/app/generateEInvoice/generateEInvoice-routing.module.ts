// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GenerateEInvoiceComponent } from './generateEInvoice.component';


const routes: Routes = [
  {
    path: '',
    component: GenerateEInvoiceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GenerateEInvoiceRoutingModule {}

