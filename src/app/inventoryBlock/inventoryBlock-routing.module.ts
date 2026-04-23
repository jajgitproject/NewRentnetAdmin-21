// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InventoryBlockComponent } from './inventoryBlock.component';

const routes: Routes = [
  {
    path: '',
    component: InventoryBlockComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryBlockRoutingModule {}

