// @ts-nocheck
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingMisComponent } from './bookingMis.component';

const routes: Routes = [{ path: '', component: BookingMisComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingMisRoutingModule {}
