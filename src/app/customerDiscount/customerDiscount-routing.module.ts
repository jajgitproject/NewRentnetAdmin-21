// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerDiscountComponent } from './customerDiscount.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerDiscountComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerDiscountRoutingModule {}

