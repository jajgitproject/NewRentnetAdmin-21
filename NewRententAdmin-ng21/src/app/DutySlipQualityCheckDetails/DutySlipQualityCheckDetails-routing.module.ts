// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DutySlipQualityCheckDetailsComponent } from './DutySlipQualityCheckDetails.component';

const routes: Routes = [
  {
    path: '',
    component: DutySlipQualityCheckDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DutySlipQualityCheckDetailsRoutingModule {}

