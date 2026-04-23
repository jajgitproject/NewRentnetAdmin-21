// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisputeComponent } from './dispute.component';


const routes: Routes = [
  {
    path: '',
    component: DisputeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DisputeRoutingModule {}

