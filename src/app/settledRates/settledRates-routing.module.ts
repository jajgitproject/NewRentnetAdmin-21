// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettledRatesComponent } from './settledRates.component';

const routes: Routes = [
  {
    path: '',
    component: SettledRatesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettledRatesRoutingModule {}

