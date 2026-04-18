// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReachedByExecutiveComponent } from './reachedByExecutive.component';

const routes: Routes = [
  {
    path: '',
    component: ReachedByExecutiveComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReachedByExecutiveRoutingModule {}

