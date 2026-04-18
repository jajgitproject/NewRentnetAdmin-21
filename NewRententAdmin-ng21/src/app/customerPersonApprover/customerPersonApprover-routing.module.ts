// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerPersonApproverComponent } from './customerPersonApprover.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerPersonApproverComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerPersonApproverRoutingModule {}

