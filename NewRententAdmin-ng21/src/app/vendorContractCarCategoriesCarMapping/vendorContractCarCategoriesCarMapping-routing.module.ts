// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorContractCarCategoriesCarMappingComponent } from './vendorContractCarCategoriesCarMapping.component';

const routes: Routes = [
  {
    path: '',
    component: VendorContractCarCategoriesCarMappingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorContractCarCategoriesCarMappingRoutingModule {}

