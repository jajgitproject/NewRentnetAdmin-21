// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InventoryComplianceDashboardComponent } from './inventoryComplianceDashboard.component';


const routes: Routes = [
  {
    path: '',
    component: InventoryComplianceDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryComplianceDashboardRoutingModule {}

