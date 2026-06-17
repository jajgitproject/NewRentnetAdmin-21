// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BulkChangeCustomerCollectionExecutiveComponent } from './bulkChangeCustomerCollectionExecutive.component';

const routes: Routes = [
  {
    path: '',
    component: BulkChangeCustomerCollectionExecutiveComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BulkChangeCustomerCollectionExecutiveRoutingModule {}
