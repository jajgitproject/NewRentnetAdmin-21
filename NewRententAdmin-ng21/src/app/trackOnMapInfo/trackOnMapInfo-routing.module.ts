// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TrackOnMapInfoComponent } from './trackOnMapInfo.component';

const routes: Routes = [
  {
    path: '',
    component: TrackOnMapInfoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrackOnMapInfoRoutingModule {}

