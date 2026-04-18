// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerReservationFieldValuesComponent } from './customerReservationFieldValues.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerReservationFieldValuesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerReservationFieldValuesRoutingModule {}

