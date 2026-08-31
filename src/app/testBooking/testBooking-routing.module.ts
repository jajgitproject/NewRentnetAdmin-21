// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestBookingComponent } from './testBooking.component';

const routes: Routes = [
  {
    path: '',
    component: TestBookingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestBookingRoutingModule {}
