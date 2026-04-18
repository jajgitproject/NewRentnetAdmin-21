// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SDUnLimitedRateComponent } from './sdUnLimitedRate.component';

const routes: Routes = [
  {
    path: '',
    component: SDUnLimitedRateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SDUnLimitedRateRoutingModule {}

