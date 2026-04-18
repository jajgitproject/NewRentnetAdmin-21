// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookingBackupMISComponent } from './bookingBackupMIS.component';

const routes: Routes = [
  {
    path: '',
    component: BookingBackupMISComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingBackupMISRoutingModule {}

