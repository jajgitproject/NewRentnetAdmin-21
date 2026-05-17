// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BranchOverviewDashboardComponent } from './branchOverviewDashboard.component';

const routes: Routes = [
  {
    path: '',
    component: BranchOverviewDashboardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BranchOverviewDashboardRoutingModule {}
