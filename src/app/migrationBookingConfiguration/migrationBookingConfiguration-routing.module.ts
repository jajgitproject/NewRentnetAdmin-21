// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MigrationBookingConfigurationComponent } from './migrationBookingConfiguration.component';

const routes: Routes = [
  {
    path: '',
    component: MigrationBookingConfigurationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MigrationBookingConfigurationRoutingModule {}

