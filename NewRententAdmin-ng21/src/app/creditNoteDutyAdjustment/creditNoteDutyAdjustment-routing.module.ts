// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreditNoteDutyAdjustmentComponent } from './creditNoteDutyAdjustment.component';

const routes: Routes = [
  {
    path: '',
    component: CreditNoteDutyAdjustmentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditNoteDutyAdjustmentRoutingModule {}

