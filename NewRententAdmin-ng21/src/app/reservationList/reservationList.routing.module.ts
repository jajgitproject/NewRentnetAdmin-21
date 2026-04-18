// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReservationListComponent } from './reservationList.component';

const routes: Routes = [
  {
    path: '',
    component: ReservationListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservationListRoutingModule {}

