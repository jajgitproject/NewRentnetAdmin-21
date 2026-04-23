// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CancelReservationAndAllotmentComponent } from './cancelReservationAndAllotment.component';

const routes: Routes = [
  {
    path: '',
    component: CancelReservationAndAllotmentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CancelReservationAndAllotmentRoutingModule {}

