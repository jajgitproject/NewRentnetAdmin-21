// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerReservationExecutiveComponent } from './customerReservationExecutive.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerReservationExecutiveComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerReservationExecutiveRoutingModule {}

