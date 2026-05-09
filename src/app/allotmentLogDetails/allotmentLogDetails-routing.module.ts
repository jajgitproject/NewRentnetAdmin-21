// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllotmentLogDetailsComponent } from './allotmentLogDetails.component';

const routes: Routes = [
  {
    path: '',
    component: AllotmentLogDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllotmentLogDetailsRoutingModule {}

