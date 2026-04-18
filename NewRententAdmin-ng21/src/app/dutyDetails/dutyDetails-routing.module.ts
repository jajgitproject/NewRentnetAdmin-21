// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DutyDetailsComponent } from './dutyDetails.component';

const routes: Routes = [
  {
    path: '',
    component: DutyDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DutyDetailsRoutingModule {}

