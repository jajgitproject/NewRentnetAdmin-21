// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerSalesManagerComponent } from './customerSalesManager.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerSalesManagerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerSalesManagerRoutingModule {}

