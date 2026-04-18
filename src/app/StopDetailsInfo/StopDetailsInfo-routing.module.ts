// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StopDetailsInfoComponent } from './StopDetailsInfo.component';

const routes: Routes = [
  {
    path: '',
    component: StopDetailsInfoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StopDetailsInfoRoutingModule {}

