// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReservationAlertComponent } from './reservationAlert.component';

const routes: Routes = [
  {
    path: '',
    component: ReservationAlertComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservationAlertRoutingModule {}

