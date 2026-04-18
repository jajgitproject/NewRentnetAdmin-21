// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DutyStateComponent } from './dutyState.component';

const routes: Routes = [
  {
    path: '',
    component: DutyStateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DutyStateRoutingModule {}

