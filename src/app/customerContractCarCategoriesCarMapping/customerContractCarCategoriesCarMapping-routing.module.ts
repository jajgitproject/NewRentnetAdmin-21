// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerContractCarCategoriesCarMappingComponent } from './customerContractCarCategoriesCarMapping.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerContractCarCategoriesCarMappingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerContractCarCategoriesCarMappingRoutingModule {}

