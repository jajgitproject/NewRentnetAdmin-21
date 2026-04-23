// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookingScreenComponent } from './bookingScreen.component';

const routes: Routes = [
  {
    path: '',
    component: BookingScreenComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingScreenRoutingModule {}

