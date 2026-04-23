// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VehicleInfoComponent } from './VehicleInfo.component';

const routes: Routes = [
  {
    path: '',
    component: VehicleInfoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleInfoRoutingModule {}

