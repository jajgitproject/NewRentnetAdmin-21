// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminReportDownloadMonitoringComponent } from './adminReportDownloadMonitoring.component';

const routes: Routes = [
  {
    path: '',
    component: AdminReportDownloadMonitoringComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminReportDownloadMonitoringRoutingModule {}
