// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookerBookingPageComponent } from './bookerBookingPage.component';




const routes: Routes = [
  {
    path: '',
    component: BookerBookingPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookerBookingPageRoutingModule {}

