// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CDCLocalLumpsumRateComponent } from './cdcLocalLumpsumRate.component';

const routes: Routes = [
  {
    path: '',
    component: CDCLocalLumpsumRateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CDCLocalLumpsumRateRoutingModule {}

