// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupplierComplianceDashboardComponent } from './supplierComplianceDashboard.component';

const routes: Routes = [
  {
    path: '',
    component: SupplierComplianceDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierComplianceDashboardRoutingModule {}

