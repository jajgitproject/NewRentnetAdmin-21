// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InventoryStatusHistoryComponent } from './inventoryStatusHistory.component';

const routes: Routes = [
  {
    path: '',
    component: InventoryStatusHistoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryStatusHistoryRoutingModule {}

