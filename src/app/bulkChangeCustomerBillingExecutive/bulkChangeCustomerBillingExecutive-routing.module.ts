// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BulkChangeCustomerBillingExecutiveComponent } from './bulkChangeCustomerBillingExecutive.component';

const routes: Routes = [
  {
    path: '',
    component: BulkChangeCustomerBillingExecutiveComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BulkChangeCustomerBillingExecutiveRoutingModule {}
