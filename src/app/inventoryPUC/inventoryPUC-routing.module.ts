// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InventoryPUCComponent } from './inventoryPUC.component';

const routes: Routes = [
  {
    path: '',
    component: InventoryPUCComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryPUCRoutingModule {}

