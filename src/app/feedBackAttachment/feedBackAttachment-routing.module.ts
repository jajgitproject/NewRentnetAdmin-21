// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FeedBackAttachmentComponent } from './feedBackAttachment.component';

const routes: Routes = [
  {
    path: '',
    component: FeedBackAttachmentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeedBackAttachmentRoutingModule {}

