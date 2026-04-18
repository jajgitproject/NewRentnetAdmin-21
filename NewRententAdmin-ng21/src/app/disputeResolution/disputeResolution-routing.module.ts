// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisputeResolutionComponent } from './disputeResolution.component';

const routes: Routes = [
  {
    path: '',
    component: DisputeResolutionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DisputeResolutionRoutingModule {}

