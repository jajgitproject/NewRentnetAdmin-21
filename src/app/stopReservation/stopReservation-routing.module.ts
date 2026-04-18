// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StopReservationComponent } from './stopReservation.component';

const routes: Routes = [
  {
    path: '',
    component: StopReservationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StopReservationRoutingModule {}

