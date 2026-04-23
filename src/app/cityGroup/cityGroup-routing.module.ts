// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CityGroupComponent } from './cityGroup.component';

const routes: Routes = [
  {
    path: '',
    component: CityGroupComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CityGroupRoutingModule {}

