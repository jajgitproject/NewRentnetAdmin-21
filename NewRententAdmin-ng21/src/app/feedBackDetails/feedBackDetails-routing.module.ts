// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FeedBackDetailsComponent } from './feedBackDetails.component';


const routes: Routes = [
  {
    path: '',
    component: FeedBackDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeedBackDetailsRoutingModule {}

