// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DutySlipQualityCheckedByExecutiveComponent } from './dutySlipQualityCheckedByExecutive.component';

const routes: Routes = [
  {
    path: '',
    component: DutySlipQualityCheckedByExecutiveComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DutySlipQualityCheckedByExecutiveRoutingModule {}

