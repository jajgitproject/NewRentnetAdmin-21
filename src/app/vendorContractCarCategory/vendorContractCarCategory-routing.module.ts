// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorContractCarCategoryComponent } from './vendorContractCarCategory.component';

const routes: Routes = [
  {
    path: '',
    component: VendorContractCarCategoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorContractCarCategoryRoutingModule {}

