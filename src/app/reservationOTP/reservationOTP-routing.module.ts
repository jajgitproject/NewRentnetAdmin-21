// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReservationOTPComponent } from './reservationOTP.component';

const routes: Routes = [
  {
    path: '',
    component: ReservationOTPComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservationOTPRoutingModule {}

