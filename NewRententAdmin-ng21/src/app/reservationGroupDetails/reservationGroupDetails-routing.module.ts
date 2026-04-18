// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReservationGroupDetailsComponent } from './reservationGroupDetails.component';

const routes: Routes = [
  {
    path: '',
    component: ReservationGroupDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservationGroupDetailsRoutingModule {}

