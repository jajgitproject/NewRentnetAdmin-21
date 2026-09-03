// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MigrationBookingRequestComponent } from './migrationBookingRequest.component';

const routes: Routes = [
  {
    path: '',
    component: MigrationBookingRequestComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MigrationBookingRequestRoutingModule {}

