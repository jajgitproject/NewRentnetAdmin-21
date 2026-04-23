// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReservationDutyslipSearchComponent } from './reservationDutyslipSearch.component';

const routes: Routes = [
  {
    path: '',
    component: ReservationDutyslipSearchComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservationDutyslipSearchRoutingModule {}

