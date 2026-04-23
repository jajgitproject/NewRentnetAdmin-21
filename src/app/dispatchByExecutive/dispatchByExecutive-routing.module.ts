// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DispatchByExecutiveComponent } from './dispatchByExecutive.component';

const routes: Routes = [
  {
    path: '',
    component: DispatchByExecutiveComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DispatchByExecutiveRoutingModule {}

