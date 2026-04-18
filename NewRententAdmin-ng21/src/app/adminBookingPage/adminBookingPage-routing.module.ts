// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminBookingPageComponent } from './adminBookingPage.component';



const routes: Routes = [
  {
    path: '',
    component: AdminBookingPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminBookingPageRoutingModule {}

