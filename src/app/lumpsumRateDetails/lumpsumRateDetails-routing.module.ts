// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LumpsumRateDetailsComponent } from './lumpsumRateDetails.component';

const routes: Routes = [
  {
    path: '',
    component: LumpsumRateDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LumpsumRateDetailsRoutingModule {}

