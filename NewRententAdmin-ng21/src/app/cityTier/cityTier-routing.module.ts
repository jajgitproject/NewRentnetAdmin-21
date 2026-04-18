// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CityTierComponent } from './cityTier.component';

const routes: Routes = [
  {
    path: '',
    component: CityTierComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CityTierRoutingModule {}

