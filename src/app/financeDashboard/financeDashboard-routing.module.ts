// @ts-nocheck
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolePageGuard } from '../core/guard/role-page.guard';
import { FinanceDashboardComponent } from './financeDashboard.component';

const routes: Routes = [
  {
    path: '',
    component: FinanceDashboardComponent,
    canActivate: [RolePageGuard],
    data: { pageName: 'Finance Dashboard' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinanceDashboardRoutingModule {}
