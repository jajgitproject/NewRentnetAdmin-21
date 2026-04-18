// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DriverFeedbackInfoComponent } from './DriverFeedbackInfo.component';

const routes: Routes = [
  {
    path: '',
    component: DriverFeedbackInfoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverFeedbackInfoRoutingModule {}

