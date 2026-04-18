// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FeedBackComponent } from './feedBack.component';

const routes: Routes = [
  {
    path: '',
    component: FeedBackComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeedBackRoutingModule {}

