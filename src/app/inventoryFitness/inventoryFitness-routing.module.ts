// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InventoryFitnessComponent } from './inventoryFitness.component';

const routes: Routes = [
  {
    path: '',
    component: InventoryFitnessComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryFitnessRoutingModule {}

