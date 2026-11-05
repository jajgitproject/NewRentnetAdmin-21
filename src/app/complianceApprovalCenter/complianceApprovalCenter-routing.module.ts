// @ts-nocheck
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComplianceApprovalCenterComponent } from './complianceApprovalCenter.component';

const routes: Routes = [
  {
    path: '',
    component: ComplianceApprovalCenterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComplianceApprovalCenterRoutingModule {}
