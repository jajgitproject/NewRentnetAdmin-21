// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FuelRateComponent } from './fuelRate.component';

const routes: Routes = [
  {
    path: '',
    component: FuelRateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FuelRateRoutingModule {}

