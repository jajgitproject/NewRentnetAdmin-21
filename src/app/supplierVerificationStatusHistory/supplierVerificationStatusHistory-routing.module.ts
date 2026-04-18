// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupplierVerificationStatusHistoryComponent } from './supplierVerificationStatusHistory.component';

const routes: Routes = [
  {
    path: '',
    component: SupplierVerificationStatusHistoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierVerificationStatusHistoryRoutingModule {}

