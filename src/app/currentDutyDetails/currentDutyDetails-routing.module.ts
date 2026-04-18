// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CurrentDutyDetailsComponent } from './currentDutyDetails.component';

const routes: Routes = [
  {
    path: '',
    component: CurrentDutyDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CurrentDutyDetailsRoutingModule {}

