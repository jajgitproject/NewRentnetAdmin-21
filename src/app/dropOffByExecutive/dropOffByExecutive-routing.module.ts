// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DropOffByExecutiveComponent } from './dropOffByExecutive.component';

const routes: Routes = [
  {
    path: '',
    component: DropOffByExecutiveComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DropOffByExecutiveRoutingModule {}

