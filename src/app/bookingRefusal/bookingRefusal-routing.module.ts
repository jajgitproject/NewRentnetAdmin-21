// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookingRefusalComponent } from './bookingRefusal.component';

const routes: Routes = [
  {
    path: '',
    component: BookingRefusalComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingRefusalRoutingModule {}
