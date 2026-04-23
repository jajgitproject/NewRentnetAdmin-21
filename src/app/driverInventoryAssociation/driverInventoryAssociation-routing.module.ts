// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DriverInventoryAssociationComponent } from './driverInventoryAssociation.component';

const routes: Routes = [
  {
    path: '',
    component: DriverInventoryAssociationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverInventoryAssociationRoutingModule {}

