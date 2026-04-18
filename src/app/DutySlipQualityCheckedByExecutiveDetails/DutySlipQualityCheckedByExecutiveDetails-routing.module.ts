// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DutySlipQualityCheckedByExecutiveDetailsComponent } from './DutySlipQualityCheckedByExecutiveDetails.component';

const routes: Routes = [
  {
    path: '',
    component: DutySlipQualityCheckedByExecutiveDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DutySlipQualityCheckedByExecutiveDetailsRoutingModule {}

