// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReservationGroupComponent } from './reservationGroup.component';

const routes: Routes = [
  {
    path: '',
    component: ReservationGroupComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservationGroupRoutingModule {}

