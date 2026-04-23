// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InventoryInsuranceComponent } from './inventoryInsurance.component';

const routes: Routes = [
  {
    path: '',
    component: InventoryInsuranceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryInsuranceRoutingModule {}

