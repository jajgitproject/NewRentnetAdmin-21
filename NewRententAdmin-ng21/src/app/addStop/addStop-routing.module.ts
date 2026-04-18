// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddStopComponent } from './addStop.component';

const routes: Routes = [
  {
    path: '',
    component: AddStopComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddStopRoutingModule {}

