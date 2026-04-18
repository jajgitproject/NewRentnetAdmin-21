// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DutySlipLTRStatementComponent } from './dutySlipLTRStatement.component';

const routes: Routes = [
  {
    path: '',
    component: DutySlipLTRStatementComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DutySlipLTRStatementRoutingModule {}

