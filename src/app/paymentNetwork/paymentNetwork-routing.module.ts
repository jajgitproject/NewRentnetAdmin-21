// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentNetworkComponent } from './paymentNetwork.component';

const routes: Routes = [
  {
    path: '',
    component: PaymentNetworkComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentNetworkRoutingModule {}

