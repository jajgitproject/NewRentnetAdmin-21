// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerReservationFieldsComponent } from './customerReservationFields.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerReservationFieldsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerReservationFieldsRoutingModule {}

