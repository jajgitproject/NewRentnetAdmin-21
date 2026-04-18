// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupplierVerificationDocumentsComponent } from './supplierVerificationDocuments.component';

const routes: Routes = [
  {
    path: '',
    component: SupplierVerificationDocumentsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierVerificationDocumentsRoutingModule {}

