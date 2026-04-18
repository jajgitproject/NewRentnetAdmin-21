// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StopDetailsComponent } from './stopDetails.component';

const routes: Routes = [
  {
    path: '',
    component: StopDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StopDetailsRoutingModule {}

