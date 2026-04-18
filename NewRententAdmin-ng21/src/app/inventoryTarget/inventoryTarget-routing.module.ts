// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InventoryTargetComponent } from './inventoryTarget.component';

const routes: Routes = [
  {
    path: '',
    component: InventoryTargetComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryTargetRoutingModule {}

