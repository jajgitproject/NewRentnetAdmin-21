// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GeoPointTypeComponent } from './geoPointType.component';

const routes: Routes = [
  {
    path: '',
    component: GeoPointTypeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeoPointTypeRoutingModule {}

