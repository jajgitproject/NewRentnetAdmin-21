// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DutySlipForBillingComponent } from './dutySlipForBilling.component';

const routes: Routes = [
  {
    path: '',
    component: DutySlipForBillingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DutySlipForBillingRoutingModule {}

