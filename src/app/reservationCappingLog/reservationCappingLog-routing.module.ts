// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReservationCappingLogComponent } from './reservationCappingLog.component';

const routes: Routes = [
  {
    path: '',
    component: ReservationCappingLogComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservationCappingLogRoutingModule {}
