// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReservationDetailsComponent } from './reservationDetails.component';

const routes: Routes = [
  {
    path: '',
    component: ReservationDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservationDetailsRoutingModule {}

