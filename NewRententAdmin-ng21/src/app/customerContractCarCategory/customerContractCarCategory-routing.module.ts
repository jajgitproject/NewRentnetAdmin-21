// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerContractCarCategoryComponent } from './customerContractCarCategory.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerContractCarCategoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerContractCarCategoryRoutingModule {}

