// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookingConfigurationComponent } from './bookingConfiguration.component';

const routes: Routes = [
  {
    path: '',
    component: BookingConfigurationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingConfigurationRoutingModule {}

