// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerReservationAlertComponent } from './customerReservationAlert.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerReservationAlertComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerReservationAlertRoutingModule {}

