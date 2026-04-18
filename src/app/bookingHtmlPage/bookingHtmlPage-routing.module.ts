// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookingHtmlPageComponent } from './bookingHtmlPage.component';



const routes: Routes = [
  {
    path: '',
    component: BookingHtmlPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingHtmlPageRoutingModule {}

