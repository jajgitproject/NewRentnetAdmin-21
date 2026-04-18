// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModeOfPaymentComponent } from './modeOfPayment.component';

const routes: Routes = [
  {
    path: '',
    component: ModeOfPaymentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModeOfPaymentRoutingModule {}

