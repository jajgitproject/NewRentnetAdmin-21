// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerCreditChargesComponent } from './customerCreditCharges.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerCreditChargesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerCreditChargesRoutingModule {}

