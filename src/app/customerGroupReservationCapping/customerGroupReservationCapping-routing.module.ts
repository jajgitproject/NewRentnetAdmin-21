// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerGroupReservationCappingComponent } from './customerGroupReservationCapping.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerGroupReservationCappingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerGroupReservationCappingRoutingModule {}

