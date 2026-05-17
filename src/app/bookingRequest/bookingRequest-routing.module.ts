// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookingRequestComponent } from './bookingRequest.component';

const routes: Routes = [
  {
    path: '',
    component: BookingRequestComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingRequestRoutingModule {}

A