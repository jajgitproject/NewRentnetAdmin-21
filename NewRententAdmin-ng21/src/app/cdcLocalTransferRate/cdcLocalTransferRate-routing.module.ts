// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CDCLocalTransferRateComponent } from './cdcLocalTransferRate.component';

const routes: Routes = [
  {
    path: '',
    component: CDCLocalTransferRateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CDCLocalTransferRateRoutingModule {}

