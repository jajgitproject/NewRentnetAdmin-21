// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CityBasedSpotsComponent } from './CityBasedSpots.component';

const routes: Routes = [
  {
    path: '',
    component: CityBasedSpotsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CityBasedSpotsRoutingModule {}

