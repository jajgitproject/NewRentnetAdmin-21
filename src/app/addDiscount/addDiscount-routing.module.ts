// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddDiscountComponent } from './addDiscount.component';

const routes: Routes = [
  {
    path: '',
    component: AddDiscountComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddDiscountRoutingModule {}

