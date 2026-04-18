// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdditionalServiceRateComponent } from './additionalServiceRate.component';

const routes: Routes = [
  {
    path: '',
    component: AdditionalServiceRateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdditionalServiceRateRoutingModule {}

