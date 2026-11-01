// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocationCityMappingComponent } from './locationCityMapping.component';

const routes: Routes = [
  {
    path: '',
    component: LocationCityMappingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationCityMappingRoutingModule {}
