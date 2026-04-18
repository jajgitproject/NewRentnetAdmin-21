// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JajInvoiceMultiDutiesComponent } from './jajInvoiceMultiDuties.component';
const routes: Routes = [
  {
    path: '',
    component: JajInvoiceMultiDutiesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JajInvoiceMultiDutiesRoutingModule {}

