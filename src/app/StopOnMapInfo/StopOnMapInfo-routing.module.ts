// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StopOnMapInfoComponent } from './StopOnMapInfo.component';

const routes: Routes = [
  {
    path: '',
    component: StopOnMapInfoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StopOnMapInfoRoutingModule {}

