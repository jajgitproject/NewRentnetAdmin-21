// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrintBlankDutySlipComponent } from './PrintBlankDutySlip.component';


const routes: Routes = [
  {
    path: '',
    component: PrintBlankDutySlipComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrintBlankDutySlipRoutingModule {}

