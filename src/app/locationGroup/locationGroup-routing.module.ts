// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocationGroupComponent } from './locationGroup.component';

const routes: Routes = [
  {
    path: '',
    component: LocationGroupComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationGroupRoutingModule {}

