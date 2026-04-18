// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerCategoryMappingComponent } from './customerCategoryMapping.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerCategoryMappingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerCategoryMappingRoutingModule {}

