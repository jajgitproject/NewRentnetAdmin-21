// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DutySlipQualityCheckComponent } from './dutySlipQualityCheck.component';

const routes: Routes = [
  {
    path: '',
    component: DutySlipQualityCheckComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DutySlipQualityCheckRoutingModule {}

