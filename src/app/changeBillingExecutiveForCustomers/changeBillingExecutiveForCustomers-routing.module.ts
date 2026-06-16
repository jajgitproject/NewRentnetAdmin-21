// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangeBillingExecutiveForCustomersComponent } from './changeBillingExecutiveForCustomers.component';

const routes: Routes = [
  {
    path: '',
    component: ChangeBillingExecutiveForCustomersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChangeBillingExecutiveForCustomersRoutingModule {}
