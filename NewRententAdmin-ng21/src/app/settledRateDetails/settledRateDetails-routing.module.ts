// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettledRateDetailsComponent } from './settledRateDetails.component';

const routes: Routes = [
  {
    path: '',
    component: SettledRateDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettledRateDetailsRoutingModule {}

