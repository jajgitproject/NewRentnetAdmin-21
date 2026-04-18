// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisputeTypeComponent } from './disputeType.component';




const routes: Routes = [
  {
    path: '',
    component: DisputeTypeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DisputeTypeRoutingModule {}

