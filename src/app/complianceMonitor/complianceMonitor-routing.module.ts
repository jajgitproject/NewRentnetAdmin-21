// @ts-nocheck
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComplianceMonitorComponent } from './complianceMonitor.component';

const routes: Routes = [{ path: '', component: ComplianceMonitorComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComplianceMonitorRoutingModule {}
