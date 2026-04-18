// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientWiseReportComponent } from './clientWiseReport.component';

const routes: Routes = [
  {
    path: '',
    component: ClientWiseReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientWiseReportRoutingModule {}

