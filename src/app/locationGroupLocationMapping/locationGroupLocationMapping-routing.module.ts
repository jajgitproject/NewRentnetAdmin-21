// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocationGroupLocationMappingComponent } from './locationGroupLocationMapping.component';

const routes: Routes = [
  {
    path: '',
    component: LocationGroupLocationMappingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationGroupLocationMappingRoutingModule {}

