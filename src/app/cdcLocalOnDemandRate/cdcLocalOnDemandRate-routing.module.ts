// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CDCLocalOnDemandRateComponent } from './cdcLocalOnDemandRate.component';

const routes: Routes = [
  {
    path: '',
    component: CDCLocalOnDemandRateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CDCLocalOnDemandRateRoutingModule {}

