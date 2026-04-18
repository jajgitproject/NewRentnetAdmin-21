// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DutyTrackingComponent } from './dutyTracking.component';

const routes: Routes = [
  {
    path: '',
    component: DutyTrackingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DutyTrackingRoutingModule {}

