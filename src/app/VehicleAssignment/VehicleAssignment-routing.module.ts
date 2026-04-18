// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VehicleAssignmentComponent } from './VehicleAssignment.component';

const routes: Routes = [
  {
    path: '',
    component: VehicleAssignmentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleAssignmentRoutingModule {}

