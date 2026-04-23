// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TravllerBookingPageComponent } from './travllerBookingPage.component';



const routes: Routes = [
  {
    path: '',
    component: TravllerBookingPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TravllerBookingPageRoutingModule {}

