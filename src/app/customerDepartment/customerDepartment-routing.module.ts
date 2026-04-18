// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerDepartmentComponent } from './customerDepartment.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerDepartmentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerDepartmentRoutingModule {}

