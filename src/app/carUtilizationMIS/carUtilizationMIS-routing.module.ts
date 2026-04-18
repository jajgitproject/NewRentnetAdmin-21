// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CarUtilizationMISComponent } from './carUtilizationMIS.component';

const routes: Routes = [
  {
    path: '',
    component: CarUtilizationMISComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarUtilizationMISRoutingModule {}

