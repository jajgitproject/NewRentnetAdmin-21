// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerForSalesManagerComponent } from './customerForSalesManager.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerForSalesManagerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerForSalesManagerRoutingModule {}

