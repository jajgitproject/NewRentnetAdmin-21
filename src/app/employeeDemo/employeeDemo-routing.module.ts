// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeDemoComponent } from './employeeDemo.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeeDemoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeDemoRoutingModule {}

