// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MonthlyBusinessReportComponent } from './monthlyBusinessReport.component';

const routes: Routes = [
  {
    path: '',
    component: MonthlyBusinessReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonthlyBusinessReportRoutingModule {}

