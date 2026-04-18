// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DateWiseCarwiseBookingReportComponent } from './dateWiseCarwiseBookingReport.component';

const routes: Routes = [
  {
    path: '',
    component: DateWiseCarwiseBookingReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DateWiseCarwiseBookingReportRoutingModule {}

