// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SpotInCityComponent } from './spotInCity.component';

const routes: Routes = [
  {
    path: '',
    component: SpotInCityComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpotInCityRoutingModule {}

