// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReservationLocationTransferLogComponent } from './reservationLocationTransferLog.component';

const routes: Routes = [
  {
    path: '',
    component: ReservationLocationTransferLogComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservationLocationTransferLogRoutingModule {}

