// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerConfigurationReservationComponent } from './customerConfigurationReservation.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerConfigurationReservationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerConfigurationReservationRoutingModule {}

