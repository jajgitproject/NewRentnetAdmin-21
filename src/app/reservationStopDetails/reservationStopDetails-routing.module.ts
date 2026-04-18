// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReservationStopDetailsComponent } from './reservationStopDetails.component';

const routes: Routes = [
  {
    path: '',
    component: ReservationStopDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservationStopDetailsRoutingModule {}

