// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerReservationCappingComponent } from './customerReservationCapping.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerReservationCappingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerReservationCappingRoutingModule {}

