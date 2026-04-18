// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StopDetailsShowComponent } from './stopDetailsShow.component';

const routes: Routes = [
  {
    path: '',
    component: StopDetailsShowComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StopDetailsShowRoutingModule {}

