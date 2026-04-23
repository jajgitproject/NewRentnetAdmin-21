// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PassengerDetailsComponent } from './passengerDetails.component';

const routes: Routes = [
  {
    path: '',
    component: PassengerDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PassengerDetailsRoutingModule {}

