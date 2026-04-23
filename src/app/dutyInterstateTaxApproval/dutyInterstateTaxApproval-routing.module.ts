// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DutyInterstateTaxApprovalComponent } from './dutyInterstateTaxApproval.component';

const routes: Routes = [
  {
    path: '',
    component: DutyInterstateTaxApprovalComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DutyInterstateTaxApprovalRoutingModule {}

