// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeLocationComponent } from './employeeLocation.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeeLocationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeLocationRoutingModule {}

