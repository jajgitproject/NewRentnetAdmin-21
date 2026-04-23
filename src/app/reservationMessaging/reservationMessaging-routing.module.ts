// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReservationMessagingComponent } from './reservationMessaging.component';

const routes: Routes = [
  {
    path: '',
    component: ReservationMessagingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservationMessagingRoutingModule {}

