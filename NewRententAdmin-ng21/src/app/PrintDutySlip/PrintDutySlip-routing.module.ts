// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrintDutySlipComponent } from './PrintDutySlip.component';

const routes: Routes = [
  {
    path: '',
    component: PrintDutySlipComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrintDutySlipRoutingModule {}

