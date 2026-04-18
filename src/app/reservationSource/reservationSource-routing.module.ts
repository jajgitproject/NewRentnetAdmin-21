// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReservationSourceComponent } from './reservationSource.component';

const routes: Routes = [
  {
    path: '',
    component: ReservationSourceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservationSourceRoutingModule {}

