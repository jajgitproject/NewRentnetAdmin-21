// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VehicleCategoryComponent } from './vehicleCategory.component';

const routes: Routes = [
  {
    path: '',
    component: VehicleCategoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleCategoryRoutingModule {}

