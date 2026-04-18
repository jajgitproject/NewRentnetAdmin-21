// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InventoryDocumentComponent } from './inventoryDocument.component';

const routes: Routes = [
  {
    path: '',
    component: InventoryDocumentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryDocumentRoutingModule {}

