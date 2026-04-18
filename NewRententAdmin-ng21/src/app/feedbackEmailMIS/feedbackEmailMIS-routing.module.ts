// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FeedbackEmailMISComponent } from './feedbackEmailMIS.component';

const routes: Routes = [
  {
    path: '',
    component:FeedbackEmailMISComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeedbackEmailMISRoutingModule {}

