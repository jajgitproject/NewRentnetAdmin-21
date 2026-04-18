// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DriverRewardComponent } from './driverReward.component';

const routes: Routes = [
  {
    path: '',
    component: DriverRewardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverRewardRoutingModule {}

