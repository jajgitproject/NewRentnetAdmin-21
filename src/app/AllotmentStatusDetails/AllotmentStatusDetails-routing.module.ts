// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllotmentStatusDetailsComponent } from './AllotmentStatusDetails.component';

const routes: Routes = [
  {
    path: '',
    component: AllotmentStatusDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllotmentStatusDetailsRoutingModule {}

