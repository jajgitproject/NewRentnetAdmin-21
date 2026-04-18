// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupplierRequiredDocumentComponent } from './supplierRequiredDocument.component';

const routes: Routes = [
  {
    path: '',
    component: SupplierRequiredDocumentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierRequiredDocumentRoutingModule {}

