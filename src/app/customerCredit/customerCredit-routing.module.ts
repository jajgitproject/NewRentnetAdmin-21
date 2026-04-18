// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerCreditComponent } from './customerCredit.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerCreditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerCreditRoutingModule {}

