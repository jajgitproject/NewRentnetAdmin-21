// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InventoryPermitComponent } from './inventoryPermit.component';

const routes: Routes = [
  {
    path: '',
    component: InventoryPermitComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryPermitRoutingModule {}

