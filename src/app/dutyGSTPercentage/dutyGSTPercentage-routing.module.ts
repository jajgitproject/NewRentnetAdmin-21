// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DutyGSTPercentageComponent } from './dutyGSTPercentage.component';

const routes: Routes = [
  {
    path: '',
    component: DutyGSTPercentageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DutyGSTPercentageRoutingModule {}

