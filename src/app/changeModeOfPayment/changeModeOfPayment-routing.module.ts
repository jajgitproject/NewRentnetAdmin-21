// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangeModeOfPaymentComponent } from './changeModeOfPayment.component';

const routes: Routes = [
  {
    path: '',
    component: ChangeModeOfPaymentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChangeModeOfPaymentRoutingModule {}
