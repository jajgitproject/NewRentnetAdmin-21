// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DiscountDetailsComponent } from './discountDetails.component';

const routes: Routes = [
  {
    path: '',
    component: DiscountDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiscountDetailsRoutingModule {}

