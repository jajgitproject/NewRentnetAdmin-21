// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TripFeedBackComponent } from './tripFeedBack.component';

const routes: Routes = [
  {
    path: '',
    component: TripFeedBackComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TripFeedBackRoutingModule {}

