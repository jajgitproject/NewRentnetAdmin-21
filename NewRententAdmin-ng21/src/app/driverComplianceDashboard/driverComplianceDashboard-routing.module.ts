// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DriverComplianceDashboardComponent } from './driverComplianceDashboard.component';


const routes: Routes = [
  {
    path: '',
    component: DriverComplianceDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverComplianceDashboardRoutingModule {}

