// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReservationClosingDetailsComponent } from './reservationClosingDetails.component';

const routes: Routes = [
  {
    path: '',
    component: ReservationClosingDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservationClosingDetailsRoutingModule {}

